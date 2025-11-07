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
    name: 'mode',
    message: 'Set mode',
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
    type: (prev, values) => values.command == 1 && values.mode == 'walk pixel' ? 'select' : null,
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
    type: (prev, values) => values.command == 1 && values.mode != 'solid' ? 'number' : null,
    name: 'interval',
    message: 'Enter interval (milliseconds)',
  },
  {
    type: 'number',
    name: 'numLeds',
    message: 'Enter number of LEDs (0-100)',
    min: 0,
    max: 100
  },
  {
    type: (prev, values) => values.command == 1 ? 'number' : null,
    name: 'brightnessValue',
    message: 'Enter brightness (0-255)',
    min: 0,
    max: 255
  },
  {
    type: (prev, values) => values.command == 1 && values.mode != 'change' && values.mode != 'wheel' && values.mode != 'sparkle' ? 'select' : null,
    name: 'color',
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
    type: (prev, values) => values.command == 1 && values.color == 'random' && values.mode != 'solid' && values.mode != 'change' ? 'select' : null,
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
    type: (prev, values) => values.command == 1 && values.color == 'random' && values.randomColorMode === 'change' && values.mode !== 'blink' ? 'select' : null,
    name: 'colorChangeInterval',
    message: 'Set color change interval',
    choices: [
      {
        title: 'After every pixel',
        value: 'everyPixel'
      },
      {
        title: 'At end of strand',
        value: 'everyLoop'
      }
    ]
  },
  {
    type: (prev, values) => values.command == 1 && values.color == 'custom' ? 'number' : null,
    name: 'red',
    message: 'Enter red value (0-255)',
    min: 0,
    max: 255
  },
  {
    type: (prev, values) => values.command == 1 && values.color == 'custom' ? 'number' : null,
    name: 'green',
    message: 'Enter green value (0-255)',
    min: 0,
    max: 255
  },
  {
    type: (prev, values) => values.command == 1 && values.color == 'custom' ? 'number' : null,
    name: 'blue',
    message: 'Enter blue value (0-255)',
    min: 0,
    max: 255
  }
];
