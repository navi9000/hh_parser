import { ref } from "vue"
import { startBrowser } from "../api/startBrowser"

function useStartBrowser() {
  const isStarting = ref(false)
  const errorMessage = ref("")

  async function start(): Promise<void> {
    isStarting.value = true
    errorMessage.value = ""

    try {
      await startBrowser()
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : "Failed to start browser"
    } finally {
      isStarting.value = false
    }
  }

  return {
    isStarting,
    errorMessage,
    start,
  }
}

export { useStartBrowser }
