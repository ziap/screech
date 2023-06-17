const context = new AudioContext()

const gain_node = context.createGain()
gain_node.connect(context.destination)

const gain_slider = document.querySelector("#gain-slider")

gain_slider.addEventListener("input", e => {
  gain_node.gain.value = e.target.value
})

gain_slider.value = gain_node.gain.value

await context.audioWorklet.addModule("./noise.js")

const white_noise = new AudioWorkletNode(context, "white-noise")
const pink_noise = new AudioWorkletNode(context, "pink-noise")
const brown_noise = new AudioWorkletNode(context, "brown-noise")

let current_processor = null

async function stopSound() {
  if (current_processor != null) {
    await context.suspend()
    current_processor.disconnect()

    current_processor = null
  }
}

async function playSound(processor) {
  await stopSound()

  processor.connect(gain_node)
  current_processor = processor
  
  await context.resume();
}

document.querySelector("#white-noise-btn").addEventListener("click", () => {
  playSound(white_noise)
})

document.querySelector("#pink-noise-btn").addEventListener("click", () => {
  playSound(pink_noise)
})

document.querySelector("#brown-noise-btn").addEventListener("click", () => {
  playSound(brown_noise)
})

document.querySelector("#stop-btn").addEventListener("click", () => {
  stopSound()
})
