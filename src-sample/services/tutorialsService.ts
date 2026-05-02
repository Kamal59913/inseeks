import apiClient from "./clients/apiClient";
import { handleError } from "@/lib/utilities/handleAuth";

const tutoralsService = {
  updateTutorialStep: async (tutorialStep: number) => {
    try {
      const response = await apiClient.post(
        "/users/freelancer/profile/update",
        {
          tutorial_step: tutorialStep,
        },
      );

      return response;
    } catch (error) {
      return handleError(error);
    }
  },

  updateDismissedTutorialPages: async (dismissedPages: string[]) => {
    try {
      const response = await apiClient.post(
        "/users/freelancer/profile/update",
        {
          metadata: {
            dismissed_pages: dismissedPages,
          },
        },
      );

      return response;
    } catch (error) {
      return handleError(error);
    }
  },
};

export default tutoralsService;

