"use client";
import axios from "axios";
import Heading from "@/components/ui/heading";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ui/imageUpload";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash as TrashIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/AlertModal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useLoadingBarStore } from "@/hooks/useLoadingBarStore";

interface BillboardFormProps {
  initialData: {
    id: string | undefined;
    storeId: string | undefined;
    label: string | undefined;
    image: {
      url: string | undefined;
      cloudinaryPublicId: string | undefined;
    };
  };
}
const formSchema = z.object({
  label: z.string().min(1),
  image: z.object({
    url: z.string(),
    cloudinaryPublicId: z.string(),
  }),
});
export type BillboardFormValue = z.infer<typeof formSchema>;

const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<BillboardFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      image: {},
    },
  });

  const title = initialData?.id ? "Edit billboard" : "Create billboard";
  const description = initialData?.id
    ? "Edit a billboard"
    : "Add a new Billboard";
  const toastMessage = initialData?.id
    ? "Billboard updated"
    : "Billboard created";
  const action = initialData?.id ? "Save changes" : "Create billboard";
  const loadingBar = useLoadingBarStore();
  const onSubmit = async (data: BillboardFormValue) => {
    try {
      setLoading(true);
      loadingBar.start();
      if (initialData?.id) {
        await axios.patch(
          `/api/stores/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        await axios.post(`/api/stores/${params.storeId}/billboards`, data);
      }
      router.push(`/${params.storeId}/billboards`);
      router.refresh();
      setLoading(false);
      toast.success(toastMessage);
    } catch (error) {
      console.trace("error", error);
      toast.error("Something Went Wrong");
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      loadingBar.start();
      await axios.delete(
        `/api/stores/${params.storeId}/billboards/${params.billboardId}`
      );
      router.push(`/${params.storeId}/billboards/`);
      router.refresh();
      toast.success("Billboard deleted");
      setLoading(false);
      setOpen(false);
    } catch (error) {
      console.trace("error: ", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        setOpen={setOpen}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialData?.id && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value?.url ? [field.value] : []}
                    disabled={loading}
                    onChange={(result) => field.onChange(result[0])}
                    onRemove={() => field.onChange([])}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Billboard Label"
                      onChange={(event) => field.onChange(event.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default BillboardForm;
