"use client";

import { useActionState, useEffect, useOptimistic, useRef, useState, useTransition } from "react";
import type { ModalHandle } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PRIORITY_LABELS, PRIORITY_ORDER } from "@/lib/priority";
import type { Priority } from "@/generated/prisma/enums";
import { updateTask, deleteTask } from "@/lib/actions/tasks";
import { createSubtask, deleteSubtask, toggleSubtask } from "@/lib/actions/subtasks";
import { createTag, setTaskTag } from "@/lib/actions/tags";
import type { ActionState } from "@/lib/actions/projects";

export type TaskDetail = {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  dueDate: string | null;
  tags: { id: string; name: string; color: string }[];
  subtasks: { id: string; title: string; done: boolean }[];
};

export type ProjectTag = { id: string; name: string; color: string };

const TAG_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

function toDateInputValue(iso: string | null) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export function TaskPanel({
  task,
  projectId,
  projectTags,
  onClose,
}: {
  task: TaskDetail;
  projectId: string;
  projectTags: ProjectTag[];
  onClose: () => void;
}) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [isDeleting, startDeleteTransition] = useTransition();
  const deleteRef = useRef<ModalHandle>(null);

  const attachedTagIds = new Set(task.tags.map((tag) => tag.id));

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
            Tarefa
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
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={() => {
              if (title.trim() && title !== task.title) {
                updateTask(task.id, { title });
              }
            }}
            maxLength={200}
            className="w-full rounded-lg border border-transparent px-2 py-1 text-lg font-semibold text-neutral-900 outline-none focus:border-neutral-300 focus:bg-neutral-50 dark:text-neutral-100 dark:focus:border-neutral-700 dark:focus:bg-neutral-800"
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Prioridade
              </label>
              <select
                defaultValue={task.priority}
                onChange={(event) =>
                  updateTask(task.id, { priority: event.target.value as Priority })
                }
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-neutral-400"
              >
                {PRIORITY_ORDER.map((priority) => (
                  <option key={priority} value={priority}>
                    {PRIORITY_LABELS[priority]}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Prazo
              </label>
              <input
                type="date"
                defaultValue={toDateInputValue(task.dueDate)}
                onChange={(event) => updateTask(task.id, { dueDate: event.target.value || null })}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:[color-scheme:dark] dark:focus:border-neutral-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              onBlur={() => {
                if (description !== (task.description ?? "")) {
                  updateTask(task.id, { description: description || null });
                }
              }}
              rows={4}
              placeholder="Adicione mais detalhes..."
              className="resize-none rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-neutral-400"
            />
          </div>

          <TagSection
            taskId={task.id}
            projectId={projectId}
            projectTags={projectTags}
            attachedTagIds={attachedTagIds}
          />

          <ChecklistSection taskId={task.id} subtasks={task.subtasks} />

          <div className="mt-auto border-t border-neutral-200 pt-4 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => deleteRef.current?.open()}
              className="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
            >
              Excluir tarefa
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        ref={deleteRef}
        title={`Excluir "${task.title}"?`}
        description="Essa ação remove a tarefa e o checklist dela. Não pode ser desfeita."
        confirmLabel={isDeleting ? "Excluindo..." : "Excluir"}
        isPending={isDeleting}
        onConfirm={() =>
          startDeleteTransition(async () => {
            await deleteTask(task.id);
            onClose();
          })
        }
      />
    </>
  );
}

function TagSection({
  taskId,
  projectId,
  projectTags,
  attachedTagIds,
}: {
  taskId: string;
  projectId: string;
  projectTags: ProjectTag[];
  attachedTagIds: Set<string>;
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [color, setColor] = useState(TAG_COLORS[0]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await createTag(projectId, {}, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        if (result.tagId) {
          await setTaskTag(taskId, result.tagId, true);
        }
        formRef.current?.reset();
        setIsCreating(false);
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
        Etiquetas
      </label>
      <div className="flex flex-wrap gap-2">
        {projectTags.map((tag) => {
          const isAttached = attachedTagIds.has(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => setTaskTag(taskId, tag.id, !isAttached)}
              className="rounded-full px-2.5 py-1 text-xs font-medium transition"
              style={
                isAttached
                  ? { backgroundColor: tag.color, color: "white" }
                  : { border: `1px solid ${tag.color}`, color: tag.color }
              }
            >
              {tag.name}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setIsCreating((value) => !value)}
          className="rounded-full border border-dashed border-neutral-300 px-2.5 py-1 text-xs font-medium text-neutral-500 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          + Nova etiqueta
        </button>
      </div>

      {isCreating && (
        <form ref={formRef} action={handleSubmit} className="flex flex-col gap-2 pt-1">
          <div className="flex gap-2">
            <input
              name="name"
              placeholder="Nome da etiqueta"
              required
              maxLength={30}
              className="flex-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-neutral-400"
            />
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900"
            >
              Criar
            </button>
          </div>
          <input type="hidden" name="color" value={color} />
          <div className="flex gap-1.5">
            {TAG_COLORS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setColor(option)}
                className={`h-5 w-5 rounded-full ${color === option ? "ring-2 ring-offset-1 ring-neutral-900 dark:ring-neutral-100 dark:ring-offset-neutral-900" : ""}`}
                style={{ backgroundColor: option }}
                aria-label={`Cor ${option}`}
              />
            ))}
          </div>
          {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
        </form>
      )}
    </div>
  );
}

function ChecklistSection({
  taskId,
  subtasks,
}: {
  taskId: string;
  subtasks: { id: string; title: string; done: boolean }[];
}) {
  const [optimisticSubtasks, setOptimisticDone] = useOptimistic(
    subtasks,
    (state, { id, done }: { id: string; done: boolean }) =>
      state.map((subtask) => (subtask.id === id ? { ...subtask, done } : subtask)),
  );
  const [, startToggleTransition] = useTransition();

  const handleToggle = (id: string, done: boolean) => {
    startToggleTransition(async () => {
      setOptimisticDone({ id, done });
      await toggleSubtask(id, done);
    });
  };

  const doneCount = optimisticSubtasks.filter((subtask) => subtask.done).length;
  const totalCount = optimisticSubtasks.length;
  const progress = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);

  const initialState: ActionState = {};
  const boundCreate = createSubtask.bind(null, taskId);
  const [state, formAction, isPending] = useActionState(boundCreate, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!state.error) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
          Checklist
        </label>
        {totalCount > 0 && (
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            {doneCount}/{totalCount}
          </span>
        )}
      </div>

      {totalCount > 0 && (
        <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800">
          <div
            className="h-1.5 rounded-full bg-neutral-900 transition-all dark:bg-neutral-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="flex flex-col gap-1">
        {optimisticSubtasks.map((subtask) => (
          <div
            key={subtask.id}
            className="flex items-center gap-2 rounded-lg px-1 py-1 hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
          >
            <input
              type="checkbox"
              checked={subtask.done}
              onChange={(event) => handleToggle(subtask.id, event.target.checked)}
              className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-600"
            />
            <span
              className={`flex-1 text-sm ${subtask.done ? "text-neutral-400 line-through dark:text-neutral-500" : "text-neutral-700 dark:text-neutral-300"}`}
            >
              {subtask.title}
            </span>
            <button
              type="button"
              onClick={() => deleteSubtask(subtask.id)}
              className="text-xs text-neutral-400 hover:text-red-600 dark:text-neutral-500 dark:hover:text-red-400"
              aria-label="Remover item"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <form ref={formRef} action={formAction} className="flex gap-2">
        <input
          name="title"
          placeholder="Adicionar item..."
          maxLength={200}
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-neutral-400"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 disabled:opacity-60 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          Adicionar
        </button>
      </form>
      {state.error && <p className="text-xs text-red-600 dark:text-red-400">{state.error}</p>}
    </div>
  );
}
