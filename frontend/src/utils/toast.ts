import { toast } from "sonner";

const toasts = {
  // Video actions
  "video-create": {
    title: "Video Uploaded",
    description:
      "Your video has been successfully uploaded and is now processing.",
  },
  "video-edit": {
    title: "Video Updated",
    description: "Changes to your video details have been saved.",
  },
  "video-delete": {
    title: "Video Deleted",
    description: "The video has been permanently removed from your account.",
  },

  // Post actions
  "post-create": {
    title: "Post Published",
    description: "Your post is now live and visible to others.",
  },
  "post-edit": {
    title: "Post Updated",
    description: "Your post has been successfully updated.",
  },
  "post-delete": {
    title: "Post Deleted",
    description: "The post has been removed from your profile.",
  },

  // Comment actions
  "comment-create": {
    title: "Comment Added",
    description: "Your comment has been posted.",
  },
  "comment-edit": {
    title: "Comment Edited",
    description: "Your comment has been successfully edited.",
  },
  "comment-delete": {
    title: "Comment Deleted",
    description: "Your comment has been removed.",
  },

  // User account actions
  "user-email-update": {
    title: "Email Updated",
    description: "Your email address has been changed successfully.",
  },
  "user-password-change": {
    title: "Password Changed",
    description:
      "Your password has been updated. Make sure to remember the new one!",
  },
  "user-details-update": {
    title: "Account Information Updated",
    description: "Your account details have been saved successfully.",
  },
  "user-profile-update": {
    title: "Profile Updated",
    description: "Your profile has been successfully updated.",
  },
  "user-preference-update": {
    title: "Preferences Updated",
    description: "Your preferences have been saved.",
  },
  "user-history-toggle": {
    title: "History Preference Updated",
    description: "Your history preference have been saved.",
  },
  "user-history-delete": {
    title: "Watch History Deleted",
    description: "Your watch history have been deleted successfully.",
  },
  "user-follow-toggle": {
    title: "Follow Status Changed",
    description: "The follow status for this user has been updated.",
  },

  // User auth actions
  "user-signup": {
    title: "Account Created",
    description: "Your account has been successfully created.",
  },
  "user-login": {
    title: "Login Successful",
    description: "You have successfully logged in.",
  },
  "user-logout": {
    title: "Logged Out",
    description: "You have been successfully logged out.",
  },

  // Share Action
  "share-action": {
    title: "Link Copied",
    description: "You can now share it anywhere.",
  },
};

export type ToastType = keyof typeof toasts;

export const showToast = (type: ToastType) => {
  const { title, description } = toasts[type];

  return toast(title, {
    description,
    duration: 3000,
  });
};
