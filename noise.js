class WhiteNoiseProcessor extends AudioWorkletProcessor {
  constructor() {
    super()
  }
  
  process(_inputs, outputs, _params) {
    for (const output of outputs) {
      for (const channel of output) {
        for (let i = 0; i < channel.length; ++i) {
          channel[i] = Math.random() * 2 - 1
        }
      }
    }

    return true
  }
}

class PinkNoiseProcessor extends AudioWorkletProcessor {
  constructor() {
    super()

    this.filters = []
    this.max = 0
  }
  
  process(_inputs, outputs, _params) {
    let filter_idx = 0
    for (const output of outputs) {
      for (const channel of output) {
        while (this.filters.length <= filter_idx) {
          this.filters.push([0, 0, 0, 0, 0, 0, 0])
        }

        const filter = this.filters[filter_idx]

        for (let i = 0; i < channel.length; ++i) {
          const white = Math.random() * 2 - 1

          filter[0] = 0.99886 * filter[0] + white * 0.0555179
          filter[1] = 0.99332 * filter[1] + white * 0.0750759
          filter[2] = 0.96900 * filter[2] + white * 0.1538520
          filter[3] = 0.86650 * filter[3] + white * 0.3104856
          filter[4] = 0.55000 * filter[4] + white * 0.5329522
          filter[5] = -0.7616 * filter[5] - white * 0.0168980

          channel[i] = white * 0.5362
          for (const item of filter) {
            channel[i] += item
          }

          this.max = Math.max(this.max, Math.abs(channel[i]))
          channel[i] /= this.max

          filter[6] = white * 0.115926
        }
        filter_idx++
      }
    }

    return true
  }
}

class BrownNoiseProcessor extends AudioWorkletProcessor {
  constructor() {
    super()

    this.last = []
    this.max = 0
  }

  process(_inputs, outputs, _params) {
    let last_idx = 0

    for (const output of outputs) {
      for (const channel of output) {
        while (this.last.length <= last_idx) {
          this.last.push(0)
        }

        for (let i = 0; i < channel.length; ++i) {
          const white = Math.random() * 2 - 1
          channel[i] = (this.last[last_idx] + 0.02 * white) / 1.02
          this.last[last_idx] = channel[i]

          this.max = Math.max(this.max, Math.abs(channel[i]))
          channel[i] /= this.max
        }
        last_idx++
      }
    }

    return true
  }
}

registerProcessor("white-noise", WhiteNoiseProcessor)
registerProcessor("pink-noise", PinkNoiseProcessor)
registerProcessor("brown-noise", BrownNoiseProcessor)
