import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

class toasts {
  static toastSuccess(text) {
    toast(text, {
      theme: "auto",
      type: "success",
      position: "top-center",
      dangerouslyHTMLString: true,
    });
  }
  static toastFailed(text) {
    toast(text, {
      theme: "auto",
      type: "error",
      position: "top-center",
      dangerouslyHTMLString: true,
    });
  }
}
export default toasts;
