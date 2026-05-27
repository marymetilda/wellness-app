import { supabase } from "../lib/supabase";

export function useMealActions() {
  async function updateStatus(id: string, status: "approved" | "rejected") {
    const { error } = await supabase
      .from("meals")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.log(error);
    }
  }

  async function updateAdminComment(id: string, adminComment: string) {
    const { error } = await supabase
      .from("meals")
      .update({ admin_comment: adminComment })
      .eq("id", id);

    if (error) {
      console.log(error);
    }
  }

  return { updateStatus, updateAdminComment };
}