"use client";
import "./ricttextcss.scss";
import { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
// import Emoji from '@tiptap/extension-emoji'
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { FilePlus, Plus, SquarePen } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateTask } from "@/hooks/useTasks";
import { useUsers } from "@/hooks/useUser";
import { useLiveBlockTasks } from "@/hooks/useLiveBlockTasks";
import Icon from "./Icon";
import { X } from "lucide-react";
import IconButton from "./IconButton";
import { Combobox } from "./combobox";
import { useOpenAI } from "@/hooks/useOpenAi";
import { useQueryClient } from "@tanstack/react-query";
import AnimatedAccordion from "./ui/AnimateAccordion";
import { priorityList, projectList, statusList, tagsList } from "@/data";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";

import { all, createLowlight } from "lowlight";
import { LinkPopover } from "./linkpopover";

const lowlight = createLowlight(all);

// This is only an example, all supported languages are already loaded above
// but you can also register only specific languages to reduce bundle-size
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["todo", "inprogress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  project: z.string().optional(),
  tags: z.array(z.string()).optional(),
  userid: z.array(z.string()).optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

export function CreateTask() {
  const [open, setOpen] = useState(false);
  const {
    control,
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Typography,
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: "https",
      }),
      // Emoji,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Placeholder.configure({
        placeholder: "Describe this task",
      }),
      //   Link.configure({
      //     openOnClick: false,
      //   }),
      //   Emoji,
    ],
  });

  const setLink = useCallback(
    (url: string) => {
      // const url = window.prompt("URL", previousUrl);

      // cancelled
      if (url === null) {
        return;
      }

      // empty
      if (url === "") {
        editor?.chain().focus().extendMarkRange("link").unsetLink().run();

        return;
      }

      // update link
      editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    },
    [editor]
  );
  const { data: userData } = useUsers();
  const createTask = useCreateTask();
  const priorityValue = watch(["status", "userid", "priority", "tags", "project"]);
  const titleDesc = watch(["title", "description"]);
  const queryClient = useQueryClient();
  const { data: openAiData, refetch } = useOpenAI({
    title: titleDesc[0],
  });

  const [aiData, setAiData] = useState<{
    status?: "todo" | "inprogress" | "done";
    priority?: "low" | "medium" | "high";
    tags?: string[];
    project?: string;
  }>({});

  useEffect(() => {
    if (openAiData) {
      setAiData(openAiData);
    }
  }, [openAiData]);

  const onSubmit = (data: TaskFormData) => {
    createTask.mutate(
      {
        title: data.title,
        description: editor?.getText({ blockSeparator: "\n\n" }),
        status: data.status,
        priority: data.priority,
        userid: data.userid,
        tags: data.tags,
        project: data.project,
      },
      {
        onSuccess: (responseData) => {
          setOpen(false);
          setAiData({});
          editor?.commands.clearContent();
          reset();
        },
      }
    );
  };

  const getLabel = (
    key: string | string[],
    option: {
      label: string;
      value: string;
      icon?: React.ReactNode;
    }[]
  ) => {
    if (Array.isArray(key)) {
      return key.map((item) => option.find((i) => i.value === item)?.label).join(", ");
    }
    return option.find((item) => item.value === key)?.label;
  };

  useEffect(() => {
    if (titleDesc[0]) {
      const timeout = setTimeout(() => {
        const query = queryClient.getQueryData(["openai", titleDesc[0], ""]);
        if (!query) {
          refetch();
        }
      }, 1300);
      return () => clearTimeout(timeout);
    }
  }, [titleDesc[0]]);

  const isAllAdded = useMemo(() => {
    let isStatusAdded = true;
    if (aiData.status) {
      isStatusAdded = priorityValue[0] == aiData.status;
    }

    let isPriorityAdded = true;
    if (aiData.priority) {
      isPriorityAdded = priorityValue[2] == aiData.priority;
    }
    let isTagsAdded = true;
    if (aiData.tags) {
      isTagsAdded = aiData.tags.every((e) => priorityValue[3]?.includes(e));
    }
    let isProjectAdded = true;
    if (aiData.project) {
      isProjectAdded = priorityValue[4] == aiData.project;
    }

    return isStatusAdded && isPriorityAdded && isTagsAdded && isProjectAdded;
  }, [priorityValue, aiData]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="submit"
          className="px-4 h-9 flex gap-2 items-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          <div className="py-[6px]">Create Task</div>
          <div className="w-[1px] flex h-full bg-indigo-500"> </div>
          {/* <Icon className="py-[6px]" name="enter" /> */}
          <SquarePen size={"16"} />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-3xl p-0 m-0"
        color="gray"
        style={{
          boxShadow: "2px 2px 30px 10px #00000033",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            // className="bg-white rounded-lg w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <div className="flex gap-3 items-center py-[6px] px-2 bg-[#F5F5F580]">
                    <div className="rounded-full">
                      <Icon name="flash" />
                    </div>
                    <span className="text-sm text-gray-600">Frontend</span>
                  </div>
                  <Icon name="right" />

                  <span className="text-sm text-[#6C6F75] font-medium">New Task</span>
                </div>
              </div>

              <input
                type="text"
                placeholder="Task title"
                {...register("title")}
                className="w-full p-2 text-[16px] font-medium focus:outline-none text-[#94989E]"
              />

              {errors.title && (
                <p className="text-red-500 text-sm col-span-3 col-start-2">
                  {errors.title.message}
                </p>
              )}

              {/* <Tiptap /> */}

              {/* <textarea
                placeholder="Describe this task"
                {...register("description")}
                className="w-full p-2 focus:outline-none text-[#94989E] resize-none"
                rows={2}
              /> */}

              <EditorContent
                className="focus-visible:outline-none p-2 text-[#94989E] min-h-[60px] max-h-[160px] overflow-y-scroll"
                editor={editor}
              />

              <AnimatedAccordion isOpen={Object.keys(aiData).length && !isAllAdded ? true : false}>
                {aiData ? (
                  <div className="flex flex-wrap gap-2">
                    <Icon name="ai" />

                    {aiData.status && priorityValue[0] != aiData.status ? (
                      <IconButton
                        onClick={() => {
                          setValue("status", aiData.status);
                        }}
                        dottedborder={true}
                        variant="outline"
                      >
                        <Icon name={"dotted"} />
                        <h6
                          style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "20px",
                            color: "#94989E",
                          }}
                        >
                          {getLabel(aiData.status, statusList)}
                        </h6>
                      </IconButton>
                    ) : (
                      ""
                    )}
                    {aiData.priority && priorityValue[2] != aiData.priority ? (
                      <IconButton
                        onClick={() => {
                          setValue("priority", aiData.priority);
                        }}
                        dottedborder={true}
                        variant="outline"
                      >
                        <Icon name={"flag"} />
                        <h6
                          style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "20px",
                            color: "#94989E",
                          }}
                        >
                          {getLabel(aiData.priority, priorityList)}
                        </h6>
                      </IconButton>
                    ) : (
                      ""
                    )}

                    {aiData.tags &&
                    !aiData.tags.every((e) => {
                      return (priorityValue[3] || []).includes(e);
                    }) ? (
                      <>
                        {aiData.tags
                          .filter((e: string) => {
                            return (
                              !(priorityValue[3] || []).includes(e) &&
                              tagsList.find((i) => i.value === e)
                            );
                          })
                          .map((e: string) => (
                            <IconButton
                              onClick={() => {
                                setValue("tags", [...(priorityValue[3] || []), e]);
                              }}
                              dottedborder={true}
                              key={e}
                              variant="outline"
                            >
                              <Icon name={"tag"} />
                              <h6
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 400,
                                  lineHeight: "20px",
                                  color: "#94989E",
                                }}
                              >
                                {getLabel(e, tagsList)}
                              </h6>
                            </IconButton>
                          ))}
                      </>
                    ) : (
                      ""
                    )}
                    {aiData.project &&
                    projectList.find((e) => e.value == aiData.project) &&
                    priorityValue[4] != aiData.project ? (
                      <IconButton
                        onClick={() => {
                          setValue("project", aiData.project);
                        }}
                        dottedborder={true}
                        variant="outline"
                      >
                        <Icon name={"frame"} />
                        <h6
                          style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "20px",
                            color: "#94989E",
                          }}
                        >
                          {getLabel(aiData.project, projectList)}
                        </h6>
                      </IconButton>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )}
              </AnimatedAccordion>

              <div className="flex flex-wrap gap-2">
                {[
                  {
                    key: "status",
                    label: "Todo",
                    icon: "dotted",
                    options: statusList,
                  },
                  {
                    key: "userid",
                    label: "Assignee",
                    icon: "user",
                    mode: "multiple",
                    options: userData?.map((user: any) => ({
                      label: user.email,
                      value: user.id,
                    })),
                  },
                  {
                    key: "priority",
                    label: "Priority",
                    icon: "flag",
                    options: priorityList,
                  },
                  {
                    key: "tags",
                    label: "Tags",
                    icon: "tag",
                    mode: "multiple",
                    options: tagsList,
                  },
                  {
                    key: "project",
                    label: "Project",
                    icon: "frame",
                    options: projectList,
                  },
                ].map((item, index) => (
                  <Combobox
                    key={item.key}
                    mode={item.mode ? (item.mode as "single" | "multiple") : "single"}
                    value={priorityValue[index]}
                    setValue={(value) => {
                      setValue(item.key as keyof TaskFormData, value);
                    }}
                    options={item.options}
                    trigger={
                      <div>
                        <IconButton variant="outline">
                          <Icon name={item.icon} />
                          <h6
                            style={{
                              fontSize: "14px",
                              fontWeight: 400,
                              lineHeight: "20px",
                              color: "#94989E",
                            }}
                          >
                            {priorityValue[index] && priorityValue[index].length
                              ? getLabel(priorityValue[index], item.options)
                              : item.label}
                          </h6>
                        </IconButton>
                      </div>
                    }
                  />
                ))}
                <IconButton variant="outline">
                  <Icon name={"date"} />
                  <h6
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "20px",
                      color: "#94989E",
                    }}
                  >
                    {"Date"}
                  </h6>
                </IconButton>
              </div>
              <div className="w-full h-[1px] my-3 bg-gray-200"></div>
              <div className="flex items-center justify-between w-full">
                <div className="flex gap-2">
                  {[
                    { value: "pin" },
                    { value: "at" },
                    { value: "emoji" },
                    {
                      value: "heading",
                      onClick: () => {
                        if (editor) editor.chain().focus().toggleHeading({ level: 1 }).run();
                      },
                      activeCondition: editor?.isActive("heading", { level: 1 }),
                    },
                    {
                      value: "bold",
                      onClick: () => {
                        editor?.chain().focus().toggleBold().run();
                      },
                      activeCondition: editor?.isActive("bold"),
                    },
                    {
                      value: "italian",
                      onClick: () => {
                        editor?.chain().focus().toggleItalic().run();
                      },
                      activeCondition: editor?.isActive("italic"),
                    },
                    {
                      value: "code",
                      onClick: () => {
                        editor?.chain().focus().toggleCodeBlock().run();
                      },
                      activeCondition: editor?.isActive("codeBlock"),
                    },
                    {
                      value: "link",
                      onClick: () => {},
                      activeCondition: editor?.isActive("link"),
                    },
                    {
                      value: "number_list",
                      onClick: () => {
                        editor?.chain().focus().toggleOrderedList().run();
                      },
                      activeCondition: editor?.isActive("orderedList"),
                    },
                    {
                      value: "dottedlist",
                      onClick: () => {
                        editor?.chain().focus().toggleBulletList().run();
                      },
                      activeCondition: editor?.isActive("bulletList"),
                    },
                    {
                      value: "check_list",
                      onClick: () => {
                        editor?.chain().focus().toggleTaskList().run();
                      },
                      activeCondition: editor?.isActive("taskList"),
                    },
                  ].map((name, index) => (
                    <>
                      {name.value == "link" ? (
                        <LinkPopover
                          defaultValue={editor?.getAttributes("link").href}
                          onAdd={setLink}
                          trigger={
                            <button
                              type="button"
                              key={index}
                              onClick={() => {
                                if (name.onClick) {
                                  name.onClick();
                                }
                              }}
                              className={`p-1 text-gray-400 rounded-md hover:text-gray-600 ${
                                name.activeCondition ? "bg-gray-100" : ""
                              }`}
                            >
                              <Icon name={name.value} />
                            </button>
                          }
                        />
                      ) : (
                        <button
                          type="button"
                          key={index}
                          onClick={() => {
                            if (name.onClick) {
                              name.onClick();
                            }
                          }}
                          className={`p-1 text-gray-400 rounded-md hover:text-gray-600 ${
                            name.activeCondition ? "bg-gray-100" : ""
                          }`}
                        >
                          <Icon name={name.value} />
                        </button>
                      )}
                    </>
                  ))}
                </div>
                <Button
                  style={{
                    boxShadow: "0px 3px 0px 0px #3F2ABD",
                  }}
                  type="submit"
                  className="px-4 h-9 flex gap-2 items-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  {createTask.isPending ? (
                    <div>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="py-[6px]">Create</div>
                  <div className="w-[1px] flex h-full bg-indigo-500"> </div>
                  <Icon className="py-[6px]" name="enter" />
                </Button>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
