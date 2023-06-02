import { Guard } from "./guardInterface";
import { api } from "@tonomy/tonomy-id-sdk";
import useErrorStore from "../../common/stores/errorStore";

export class AuthGuard implements Guard {
  errorStore = useErrorStore();

  async canActivate(): Promise<boolean> {
    try {
      // Add your authentication logic here
      const user = await api.ExternalUser.getUser({ autoLogout: false });

      return !!user;
    } catch (error) {
      // Handle any errors that occur during authentication
      this.errorStore.setError({ error: error, expected: false });

      return false;
    }
  }
}
