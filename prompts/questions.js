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
    type: (prev, values) => values.command == 0 ? null : 'select',
    name: 'mode',
    message: 'Enter the mode',
    choices: [
      {
        title: 'Solid Color',
        value: 'solid color'
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
    type: (prev, values) => values.command == 0 ? null : 'number',
    name: 'brightness',
    message: 'Enter the brightness (0-255)',
    min: 0,
    max: 255
  },
  {
    type: (prev, values) => values.command == 0 ? null : 'number',
    name: 'red',
    message: 'Enter the red value (0-255)',
    min: 0,
    max: 255
  },
  {
    type: (prev, values) => values.command == 0 ? null : 'number',
    name: 'green',
    message: 'Enter the green value (0-255)',
    min: 0,
    max: 255
  },
  {
    type: (prev, values) => values.command == 0 ? null : 'number',
    name: 'blue',
    message: 'Enter the blue value (0-255)',
    min: 0,
    max: 255
  }
];
