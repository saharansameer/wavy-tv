import { CardContent, Label, Button, Switch } from "@/components/ui";
import { ErrorMessage, LoaderSpin } from "@/components";
import { showToast } from "@/utils/toast";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { historyToggleFormSchema, HistoryToggleFormSchema } from "@/app/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyAndGenerateNewToken } from "@/utils/tokenUtils";
import axios from "axios";
import useAuthStore from "@/app/store/authStore";

export function HistoryToggleForm({ isActive }: SettingComponentProps) {
  const { authUser, setAuthUser } = useAuthStore();
  const prevSearch = authUser.saveSearchHistory;
  const prevWatch = authUser.saveWatchHistory;

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<HistoryToggleFormSchema>({
    resolver: zodResolver(historyToggleFormSchema(prevSearch, prevWatch)),
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: {
      saveSearchHistory: prevSearch,
      saveWatchHistory: prevWatch,
    },
  });

  const onSubmitHandler: SubmitHandler<HistoryToggleFormSchema> = async (
    data
  ) => {
    try {
      // Check Auth
      if (!(await verifyAndGenerateNewToken())) return;

      // History Toggle Form Data
      const { saveSearchHistory, saveWatchHistory } = data;

      // PATCH request
      const res = await axios.patch("/api/v1/user/toggle/history", {
        saveSearchHistory,
        saveWatchHistory,
      });

      // Update user details in authStore
      setAuthUser(res.data.data);

      showToast("user-history-toggle");
    } catch {
      setError("saveSearchHistory", {
        type: "manual",
        message: "Something went wrong",
      });
    }
  };
  return (
    <CardContent>
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className={`space-y-2 overflow-hidden 
        transition-[max-height,opacity] duration-1000 ease-initial
        ${isActive ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <fieldset disabled={!isActive} className="space-y-5 px-1">
          {/*Error Messages*/}
          {errors.saveSearchHistory && (
            <ErrorMessage text={`${errors.saveSearchHistory.message}`} />
          )}
          {errors.saveWatchHistory && (
            <ErrorMessage text={`${errors.saveWatchHistory.message}`} />
          )}

          {/* Search History Toggle*/}
          <Controller
            control={control}
            name="saveSearchHistory"
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Save Search History</Label>
                <Switch
                  className={"cursor-pointer"}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />

          {/* Watch History Toggle*/}
          <Controller
            control={control}
            name="saveWatchHistory"
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Save Watch History</Label>
                <Switch
                  className={"cursor-pointer"}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />
          <Button type="submit" className="font-semibold">
            {isSubmitting ? <LoaderSpin /> : "Save"}
          </Button>
        </fieldset>
      </form>
    </CardContent>
  );
}
