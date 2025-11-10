export const questions = [
  {
    type: 'select',
    name: 'command',
    message: 'Enter command',
    choices: [
      {
        title: 'On',
        value: 1
      },
      {
        title: 'Off',
        value: 0
      }
    ]
  },
  {
    type: (prev, values) => values.command == 1 ? 'select' : null,
    name: 'effect',
    message: 'Set effect',
    choices: [
      {
        title: 'Solid',
        value: 'solid'
      },
      {
        title: 'Change',
        value: 'change'
      },
      {
        title: 'Blink',
        value: 'blink'
      },
      {
        title: 'Breathe',
        value: 'breathe'
      },
      {
        title: 'Creep',
        value: 'creep'
      },
      {
        title: 'Wheel',
        value: 'wheel'
      },
      {
        title: 'Walk Pixel',
        value: 'walk pixel'
      }
    ]
  },
  {
    type: (prev, values) => values.command == 1 && values.effect == 'walk pixel' ? 'select' : null,
    name: 'pixelState',
    message: 'Set pixel',
    choices: [
      {
        title: 'On',
        value: 1
      },
      {
        title: 'Off',
        value: 0
      }
    ]
  },
  {
    type: (prev, values) => values.command == 1 && values.effect != 'solid' ? 'number' : null,
    name: 'interval',
    message: 'Enter interval (milliseconds)',
  },
  {
    type: 'number',
    name: 'leds',
    message: 'Enter number of LEDs (0-100)',
    min: 0,
    max: 100
  },
  {
    type: (prev, values) => values.command == 1 ? 'number' : null,
    name: 'brightness',
    message: 'Enter brightness (0-255)',
    min: 0,
    max: 255
  },
  {
    type: (prev, values) => values.command == 1 && values.effect != 'change' && values.effect != 'wheel' ? 'select' : null,
    name: 'colorMode',
    message: 'Set color mode',
    choices: [
      {
        title: 'Custom',
        value: 'custom'
      },
      {
        title: 'Random',
        value: 'random'
      }
    ]
  },
  {
    type: (prev, values) => values.command == 1 && values.colorMode == 'random' && values.effect != 'solid' && values.effect != 'change' ? 'select' : null,
    name: 'randomColorMode',
    message: 'Set random color mode',
    choices: [
      {
        title: 'Static',
        value: 'static'
      },
      {
        title: 'Change',
        value: 'change'
      }
    ]
  },
  {
    type: (prev, values) => values.command == 1 && values.colorMode == 'random' && values.randomColorMode === 'change' && values.effect !== 'blink' ? 'select' : null,
    name: 'colorChangeInterval',
    message: 'Set color change interval',
    choices: [
      {
        title: 'After every pixel',
        value: 'everyPixel'
      },
      {
        title: 'At end of loop',
        value: 'everyLoop'
      }
    ]
  },
  {
    type: (prev, values) => values.command == 1 && values.colorMode == 'custom' ? 'number' : null,
    name: 'red',
    message: 'Enter red value (0-255)',
    min: 0,
    max: 255
  },
  {
    type: (prev, values) => values.command == 1 && values.colorMode == 'custom' ? 'number' : null,
    name: 'green',
    message: 'Enter green value (0-255)',
    min: 0,
    max: 255
  },
  {
    type: (prev, values) => values.command == 1 && values.colorMode == 'custom' ? 'number' : null,
    name: 'blue',
    message: 'Enter blue value (0-255)',
    min: 0,
    max: 255
  }
];
