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
        title: 'Solid Color',
        value: 'solid color'
      },
      {
        title: 'Random Color',
        value: 'random color'
      },
      {
        title: 'Walk pixel',
        value: 'walk pixel'
      }
    ]
  },
  {
    type: 'number',
    name: 'leds',
    message: 'Enter the number of LEDs (1-100)',
    min: 1,
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
    type: (prev, values) => values.command == 1 && values.mode != 'random color' ? 'number' : null,
    name: 'red',
    message: 'Enter the red value (0-255)',
    min: 0,
    max: 255
  },
  {
    type: (prev, values) => values.command == 1 && values.mode != 'random color' ? 'number' : null,
    name: 'green',
    message: 'Enter the green value (0-255)',
    min: 0,
    max: 255
  },
  {
    type: (prev, values) => values.command == 1 && values.mode != 'random color' ? 'number' : null,
    name: 'blue',
    message: 'Enter the blue value (0-255)',
    min: 0,
    max: 255
  }
];
