import { mount } from "@vue/test-utils"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import HomePage from "./HomePage.vue"

const browserStartApiUrl = "http://127.0.0.1:3000/browser/start"

const fetchMock = vi
  .fn<typeof fetch>()
  .mockResolvedValue(new Response(null, { status: 202 }))

describe("Run button", () => {
  beforeEach(() => {
    fetchMock.mockClear()
    vi.stubGlobal("fetch", fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("is available on the home page", () => {
    const wrapper = mount(HomePage)

    expect(wrapper.get("button").text()).toBe("Run")
  })

  it("requests a browser launch at hh.ru when clicked", async () => {
    const wrapper = mount(HomePage)

    await wrapper.get("button").trigger("click")

    expect(fetchMock).toHaveBeenCalledWith(
      browserStartApiUrl,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ url: "https://hh.ru" }),
      }),
    )
  })
})
