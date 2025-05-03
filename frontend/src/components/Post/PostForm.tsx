import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postFormSchema, PostFormSchemaType } from "@/app/schema";
import {
  TextEditor,
  LoadingOverlay,
  ErrorMessage,
  AuthUser,
  ScrollToTop,
} from "@/components";
import { Button } from "@/components/ui";
import axios from "axios";
import { verifyAndGenerateNewToken } from "@/utils/tokenUtils";
import { setQueriesInvalid } from "@/utils/reactQueryUtils";
import { showToast } from "@/utils/toast";

interface ContentFormProps {
  mode?: "post" | "patch";
  data?: any;
  postPublicId?: string;
  onClose?: () => void;
}

export function PostForm({
  mode = "post",
  data,
  postPublicId,
  onClose,
}: ContentFormProps) {
  const isEditMode = mode === "patch";

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isLoading },
  } = useForm<PostFormSchemaType>({
    resolver: zodResolver(postFormSchema),
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: isEditMode ? { content: data.content } : {},
  });

  // Form Submit Handler
  const onSubmitHandler: SubmitHandler<PostFormSchemaType> = async (data) => {
    try {
      // Form Data (Content)
      const { content } = data;

      // Edit Mode Form
      if (isEditMode) {
        // Check Auth (Edit Mode)
        if (!(await verifyAndGenerateNewToken())) return;

        // Send 'PATCH' request for Modifying Post
        await axios.patch(`/api/v1/post/${postPublicId}`, { content });

        await setQueriesInvalid();
        onClose?.();
        showToast("post-edit");
        return;
      }

      // Send 'POST' request for Creating Post
      await axios.post("/api/v1/post", { content });
    } catch (error) {
      console.log("Post Form Error:", error);
    }

    await setQueriesInvalid();
    showToast("post-create");
    reset();
  };

  if (isSubmitting || isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div
      className={`w-full max-w-xl flex flex-col gap-y-4 px-3 md:px-10 pb-7 pt-3 ${isEditMode ? "items-center" : ""}`}
    >
      <ScrollToTop />
      {!isEditMode && <AuthUser />}

      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className={`w-full flex flex-col gap-y-5 max-w-xl ${isEditMode ? "items-center" : ""}`}
      >
        <div className="w-full">
          <Controller
            control={control}
            name="content"
            render={({ field }) => (
              <>
                <TextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Whats on your mind ?"
                  className="max-w-xl h-[250px] md:h-[350px]"
                />
              </>
            )}
          />
          {errors.content && (
            <ErrorMessage text={errors.content.message as string} />
          )}
        </div>
        <Button
          variant={"default"}
          type="submit"
          className="max-w-xs sm:max-w-3xs font-semibold"
          disabled={isSubmitting}
        >
          {isEditMode ? "Save Changes" : "Post"}
        </Button>
      </form>
    </div>
  );
}
