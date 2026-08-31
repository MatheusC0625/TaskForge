"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ModalHandle } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  renameProject,
  updateProjectColor,
  updateProjectDetails,
  addProjectRepo,
  removeProjectRepo,
  deleteProject,
} from "@/lib/actions/projects";

const PROJECT_COLORS = [
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#f97316",
  "#ef4444",
  "#eab308",
  "#06b6d4",
  "#ec4899",
];

type ProjectSettingsPanelProps = {
  project: {
    id: string;
    name: string;
    description: string | null;
    color: string;
    repos: { id: string; url: string }[];
  };
  showNameField?: boolean;
  isPro?: boolean;
  onClose: () => void;
};

export function ProjectSettingsPanel({
  project,
  showNameField = true,
  isPro = false,
  onClose,
}: ProjectSettingsPanelProps) {
  const router = useRouter();
  const [name, setName] = useState(project.name);
  const [nameError, setNameError] = useState<string | null>(null);
  const [color, setColor] = useState(project.color);
  const [description, setDescription] = useState(project.description ?? "");
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [repos, setRepos] = useState(project.repos);
  const [newRepoUrl, setNewRepoUrl] = useState("");
  const [repoError, setRepoError] = useState<string | null>(null);
  const [isSavingDetails, startDetailsTransition] = useTransition();
  const [, startNameTransition] = useTransition();
  const [isSavingColor, startColorTransition] = useTransition();
  const [isAddingRepo, startAddRepoTransition] = useTransition();
  const [removingRepoId, setRemovingRepoId] = useState<string | null>(null);
  const [, startRemoveRepoTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const deleteRef = useRef<ModalHandle>(null);

  const atFreeLimit = !isPro && repos.length >= 1;

  const handleNameBlur = () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === project.name) {
      setName(project.name);
      setNameError(null);
      return;
    }
    startNameTransition(async () => {
      const result = await renameProject(project.id, trimmed);
      if (result?.error) {
        setNameError(result.error);
        setName(project.name);
      } else {
        setNameError(null);
      }
    });
  };

  const handleColorSelect = (option: string) => {
    setColor(option);
    startColorTransition(async () => {
      await updateProjectColor(project.id, option);
    });
  };

  const handleDetailsSubmit = (formData: FormData) => {
    setDetailsError(null);
    startDetailsTransition(async () => {
      const result = await updateProjectDetails(project.id, {}, formData);
      if (result?.error) setDetailsError(result.error);
    });
  };

  const handleAddRepo = (formData: FormData) => {
    setRepoError(null);
    startAddRepoTransition(async () => {
      const result = await addProjectRepo(project.id, {}, formData);
      if (result?.error) {
        setRepoError(result.error);
        return;
      }
      const url = formData.get("url") as string;
      setRepos((current) => [...current, { id: `pending-${Date.now()}`, url }]);
      setNewRepoUrl("");
    });
  };

  const handleRemoveRepo = (repoId: string) => {
    setRemovingRepoId(repoId);
    startRemoveRepoTransition(async () => {
      await removeProjectRepo(repoId);
      setRepos((current) => current.filter((repo) => repo.id !== repoId));
      setRemovingRepoId(null);
    });
  };

  return (
    <>
      <div
        className="slide-panel-backdrop fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="slide-panel fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto border-l border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
          <span className="text-xs font-medium tracking-wide text-neutral-400 uppercase dark:text-neutral-500">
            Configurações do projeto
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            aria-label="Fechar painel"
          >
            Fechar
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-6 px-5 py-5">
          {showNameField && (
            <div className="flex flex-col gap-1">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                onBlur={handleNameBlur}
                maxLength={80}
                placeholder="Nome do projeto"
                className="w-full rounded-lg border border-transparent px-2 py-1 text-lg font-semibold text-neutral-900 outline-none focus:border-neutral-300 focus:bg-neutral-50 dark:text-neutral-100 dark:focus:border-neutral-700 dark:focus:bg-neutral-800"
              />
              {nameError && <p className="px-2 text-xs text-red-600 dark:text-red-400">{nameError}</p>}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Cor do projeto
            </span>
            <div className="flex flex-wrap gap-2">
              {PROJECT_COLORS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleColorSelect(option)}
                  disabled={isSavingColor}
                  aria-label={`Cor ${option}`}
                  aria-pressed={color === option}
                  className={`h-7 w-7 rounded-full transition disabled:opacity-60 ${
                    color === option
                      ? "ring-2 ring-neutral-900 ring-offset-2 dark:ring-neutral-100 dark:ring-offset-neutral-900"
                      : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: option }}
                />
              ))}
            </div>
          </div>

          <form action={handleDetailsSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Descrição
              </label>
              <textarea
                name="description"
                rows={3}
                maxLength={500}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Descrição (opcional)"
                className="resize-none rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
              />
            </div>

            {detailsError && <p className="text-sm text-red-600 dark:text-red-400">{detailsError}</p>}

            <button
              type="submit"
              disabled={isSavingDetails}
              className="self-start rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              {isSavingDetails ? "Salvando..." : "Salvar"}
            </button>
          </form>

          <div className="flex flex-col gap-2 border-t border-neutral-200 pt-5 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Repositórios do GitHub
              </span>
              {isPro && (
                <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-medium text-white dark:bg-emerald-500">
                  Pro: ilimitados
                </span>
              )}
            </div>

            {repos.length > 0 && (
              <ul className="flex flex-col gap-1.5">
                {repos.map((repo) => (
                  <li
                    key={repo.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm dark:border-neutral-700"
                  >
                    <span className="truncate text-neutral-700 dark:text-neutral-300">{repo.url}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRepo(repo.id)}
                      disabled={removingRepoId === repo.id}
                      aria-label="Remover repositório"
                      className="shrink-0 text-neutral-400 hover:text-red-600 disabled:opacity-60 dark:hover:text-red-400"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {atFreeLimit ? (
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                Seu plano gratuito permite 1 repositório no total.{" "}
                <a href="/upgrade" className="underline hover:text-neutral-600 dark:hover:text-neutral-300">
                  Assine o Pro
                </a>{" "}
                para vincular mais.
              </p>
            ) : (
              <form action={handleAddRepo} className="flex gap-2">
                <input
                  name="url"
                  type="url"
                  value={newRepoUrl}
                  onChange={(event) => setNewRepoUrl(event.target.value)}
                  placeholder="https://github.com/usuario/repositorio"
                  className="flex-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  disabled={isAddingRepo}
                  className="shrink-0 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-60 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  {isAddingRepo ? "Adicionando..." : "Adicionar"}
                </button>
              </form>
            )}
            {repoError && <p className="text-xs text-red-600 dark:text-red-400">{repoError}</p>}
          </div>

          <div className="mt-auto flex flex-col gap-2 border-t border-neutral-200 pt-5 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => deleteRef.current?.open()}
              className="self-start rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              Excluir projeto
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        ref={deleteRef}
        title={`Excluir "${project.name}"?`}
        description="Essa ação remove o projeto e todas as colunas e tarefas dentro dele. Não pode ser desfeita."
        confirmLabel={isDeleting ? "Excluindo..." : "Excluir"}
        isPending={isDeleting}
        onConfirm={() =>
          startDeleteTransition(async () => {
            await deleteProject(project.id);
            onClose();
            router.push("/projects");
          })
        }
      />
    </>
  );
}
