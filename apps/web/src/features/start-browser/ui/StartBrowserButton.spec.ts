import { mount } from "@vue/test-utils"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import StartBrowserButton from "./StartBrowserButton.vue"

const browserStartApiUrl = "http://127.0.0.1:3000/browser/start"

const fetchMock = vi
  .fn<typeof fetch>()
  .mockResolvedValue(new Response(null, { status: 202 }))

describe("StartBrowserButton", () => {
  beforeEach(() => {
    fetchMock.mockClear()
    vi.stubGlobal("fetch", fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("requests a browser launch at hh.ru when clicked", async () => {
    const wrapper = mount(StartBrowserButton)

    await wrapper.get("button").trigger("click")

    expect(fetchMock).toHaveBeenCalledWith(
      browserStartApiUrl,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ url: "https://hh.ru" }),
      }),
    )
  })

  it("shows an error when the browser launch fails", async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 500 }))
    const wrapper = mount(StartBrowserButton)

    await wrapper.get("button").trigger("click")

    expect(wrapper.get("[role='alert']").text()).toBe(
      "Browser start failed with status 500",
    )
  })
})
