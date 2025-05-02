import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui";
import {
  EmailForm,
  PasswordForm,
  PreferencesForm,
  HistoryToggleForm,
  ScrollToTop,
} from "@/components";

const forms = {
  email: {
    title: "Email",
    description: "Update your account's email",
  },
  password: {
    title: "Password",
    description: "Change your password",
  },
  preferences: {
    title: "Preferences",
    description: "Update your preferences",
  },
  history: {
    title: "History",
    description: "Turn On/Off history",
  },
};

type FormType = keyof typeof forms;

export function Settings() {
  const [activeForm, setActiveForm] = React.useState<FormType | null>(null);

  const renderSection = (
    form: FormType,
    Component: React.ComponentType<{
      isActive: boolean;
      onCancel: () => void;
    }>
  ) => {
    const isActive = activeForm === form;
    const { title, description } = forms[form];
    return (
      <Card key={form} className="py-0 pb-5">
        <div className="h-0 relative">
          {isActive ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActiveForm(null)}
              className="absolute right-3 translate-y-3"
            >
              Cancel
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActiveForm(form)}
              className="absolute right-3 translate-y-3"
            >
              Edit
            </Button>
          )}
        </div>

        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Component isActive={isActive} onCancel={() => setActiveForm(null)} />
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full space-y-6 max-w-sm sm:max-w-lg md:max-w-xl px-2 py-2 sm:px-4 sm:py-4">
      <ScrollToTop />
      {renderSection("email", EmailForm)}
      {renderSection("password", PasswordForm)}
      {renderSection("preferences", PreferencesForm)}
      {renderSection("history", HistoryToggleForm)}
    </div>
  );
}
