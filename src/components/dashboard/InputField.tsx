import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, DiamondPlus, Loader, Pencil, Plus } from "lucide-react";
import { useAppDispatch } from "@/redux/redux.hooks";
import { createTaskThunk } from "@/redux/thunk/task.thunk";

const loginSchema = z.object({
  title: z.string().nonempty("Title is required."),
  status: z.string().nonempty("Status is required."),
  priority: z.string().nonempty("Priority is required."),
  deadline: z
    .date()
    .refine(
      (date) => date instanceof Date && !isNaN(date.getTime()),
      "Deadline is required and must be a valid date."
    ),
  description: z.string().nonempty("Description is required."),
});

interface FormData {
  title: string;
  status: string;
  priority: string;
  deadline: Date;
  description: string;
}

const InputField = () => {
  const dispatch = useAppDispatch();
  const form = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      title: "",
      status: "To-Do",
      priority: "Low",
      deadline: new Date(),
      description: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      // console.log(data);
      await dispatch(createTaskThunk(data)).unwrap();
      toast.success("Form submitted successfully!");
    } catch (error: any) {
      toast.error("An error occurred while submitting the form.");
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-1">
                <FormControl className="flex-1">
                  <input
                    type="text"
                    placeholder="Title"
                    {...field}
                    className="text-4xl border-0 focus:outline-none focus:ring-0 bg-transparent w-full text-[#666666]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-1">
                <FormLabel className="w-1/4 flex items-center gap-2 text-[#666666]">
                  <Loader />
                  Status
                </FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="border rounded-md p-2 bg-white w-fit text-[#666666]"
                  >
                    <option value="To-Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Completed">Finished</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-1">
                <FormLabel className="w-1/4 flex items-center gap-2 text-[#666666]">
                  <DiamondPlus />
                  Priority
                </FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="border rounded-md p-2 bg-white w-fit text-[#666666]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-1">
                <FormLabel className="w-1/4 flex items-center gap-2 text-[#666666]">
                  <Calendar />
                  Deadline
                </FormLabel>
                <FormControl>
                  <DatePicker
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date: Date | null) => field.onChange(date)}
                    className="border rounded-md p-2 bg-white w-fit text-[#666666]"
                    dateFormat="yyyy/MM/dd"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-1">
                <FormLabel className="w-1/4 flex items-center gap-2 text-[#666666]">
                  <Pencil />
                  Description
                </FormLabel>
                <FormControl className="flex-1">
                  <input
                    type="text"
                    placeholder="Description"
                    {...field}
                    className="border-0 focus:outline-none focus:ring-0 bg-transparent w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-2 my-2">
            <Plus />
            Add custom property
          </div>

          <Button type="submit" className="w-full bg-button-gradient">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default InputField;
