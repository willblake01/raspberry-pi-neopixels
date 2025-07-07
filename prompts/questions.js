export const questions = [
  {
    type: 'select',
    name: 'command',
    message: 'Enter a command',
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
    message: 'Enter the mode',
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
        title: 'Creep',
        value: 'creep'
      },
      {
        title: 'Blink',
        value: 'blink'
      },
      {
        title: 'Walk pixel',
        value: 'walk pixel'
      }
    ]
  },
  {
    type: (prev, values) => values.command == 1 && values.mode == 'walk pixel' ? 'select' : null,
    name: 'pixel',
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
    name: 'leds',
    message: 'Enter the number of LEDs (0-100)',
    min: 0,
    max: 100
  },
  {
    type: (prev, values) => values.command == 1 ? 'number' : null,
    name: 'brightness',
    message: 'Enter the brightness (0-255)',
    min: 0,
    max: 255
  },
  {
    type: (prev, values) => values.command == 1 && values.mode != 'change' && values.mode != 'creep' ? 'select' : null,
    name: 'color',
    message: 'Enter the color',
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
    type: (prev, values) => values.command == 1 && values.color == 'custom' ? 'number' : null,
    name: 'red',
    message: 'Enter the red value (0-255)',
    min: 0,
    max: 255
  },
  {
    type: (prev, values) => values.command == 1 && values.color == 'custom' ? 'number' : null,
    name: 'green',
    message: 'Enter the green value (0-255)',
    min: 0,
    max: 255
  },
  {
    type: (prev, values) => values.command == 1 && values.color == 'custom' ? 'number' : null,
    name: 'blue',
    message: 'Enter the blue value (0-255)',
    min: 0,
    max: 255
  }
];
