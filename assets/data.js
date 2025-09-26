window.HW_CTRL_DATA = {
  customers: [
    {
      id: "VCNX",
      label: "VCNX",
      projects: [
        {
          id: "common",
          label: "Common",
          files: [
            {
              id: "hw-ctrl.md",
              label: "預設指令",
              groups: [
                {
                  name: "Status LED (White)",
                  actions: [
                    {
                      name: "Init",
                      code: "echo 48 > /sys/class/gpio/export\necho out > /sys/class/gpio/gpio48/direction"
                    },
                    {
                      name: "ON",
                      code: "echo 1 > /sys/class/gpio/gpio48/value"
                    },
                    {
                      name: "OFF",
                      code: "echo 0 > /sys/class/gpio/gpio48/value"
                    }
                  ]
                },
                {
                  name: "Status LED (Orange)",
                  actions: [
                    {
                      name: "Init",
                      code: "echo 60 > /sys/class/gpio/export\necho out > /sys/class/gpio/gpio60/direction"
                    },
                    {
                      name: "ON",
                      code: "echo 1 > /sys/class/gpio/gpio60/value"
                    },
                    {
                      name: "OFF",
                      code: "echo 0 > /sys/class/gpio/gpio60/value"
                    }
                  ]
                },
                {
                  name: "ICR",
                  actions: [
                    {
                      name: "Init",
                      code: "echo 59 > /sys/class/gpio/export\necho out > /sys/class/gpio/gpio59/direction"
                    },
                    {
                      name: "ON",
                      code: "echo 1 > /sys/class/gpio/gpio59/value"
                    },
                    {
                      name: "OFF",
                      code: "echo 0 > /sys/class/gpio/gpio59/value"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: "mp-board",
          label: "MP Board",
          files: [
            {
              id: "hw-ctrl_vconx-mp-board.md",
              label: "MP Board 標準",
              groups: [
                {
                  name: "Status LED (White)",
                  actions: [
                    {
                      name: "Init",
                      code: "echo 48 > /sys/class/gpio/export\necho out > /sys/class/gpio/gpio48/direction"
                    },
                    {
                      name: "ON",
                      code: "echo 1 > /sys/class/gpio/gpio48/value"
                    },
                    {
                      name: "OFF",
                      code: "echo 0 > /sys/class/gpio/gpio48/value"
                    }
                  ]
                },
                {
                  name: "Status LED (Orange)",
                  actions: [
                    {
                      name: "Init",
                      code: "echo 60 > /sys/class/gpio/export\necho out > /sys/class/gpio/gpio60/direction"
                    },
                    {
                      name: "ON",
                      code: "echo 1 > /sys/class/gpio/gpio60/value"
                    },
                    {
                      name: "OFF",
                      code: "echo 0 > /sys/class/gpio/gpio60/value"
                    }
                  ]
                },
                {
                  name: "ICR",
                  actions: [
                    {
                      name: "Init",
                      code: "echo 59 > /sys/class/gpio/export\necho out > /sys/class/gpio/gpio59/direction"
                    },
                    {
                      name: "ON",
                      code: "echo 1 > /sys/class/gpio/gpio59/value"
                    },
                    {
                      name: "OFF",
                      code: "echo 0 > /sys/class/gpio/gpio59/value"
                    }
                  ]
                },
                {
                  name: "Login",
                  actions: [
                    {
                      name: "Account",
                      code: "root"
                    }
                  ]
                }
              ]
            },
            {
              id: "hw-ctrl_vconx-mp-board-2.md",
              label: "MP Board 變體",
              groups: [
                {
                  name: "Status LED 1 (White)",
                  actions: [
                    {
                      name: "Init",
                      code: "echo 48 > /sys/class/gpio/export\necho out > /sys/class/gpio/gpio48/direction"
                    },
                    {
                      name: "ON",
                      code: "echo 1 > /sys/class/gpio/gpio48/value"
                    },
                    {
                      name: "OFF",
                      code: "echo 0 > /sys/class/gpio/gpio48/value"
                    }
                  ]
                },
                {
                  name: "Status LED 1 (Orange)",
                  actions: [
                    {
                      name: "Init",
                      code: "echo 60 > /sys/class/gpio/export\necho out > /sys/class/gpio/gpio60/direction"
                    },
                    {
                      name: "ON",
                      code: "echo 1 > /sys/class/gpio/gpio60/value"
                    },
                    {
                      name: "OFF",
                      code: "echo 0 > /sys/class/gpio/gpio60/value"
                    }
                  ]
                },
                {
                  name: "ICR 1",
                  actions: [
                    {
                      name: "Init",
                      code: "echo 59 > /sys/class/gpio/export\necho out > /sys/class/gpio/gpio59/direction"
                    },
                    {
                      name: "ON",
                      code: "echo 1 > /sys/class/gpio/gpio59/value"
                    },
                    {
                      name: "OFF",
                      code: "echo 0 > /sys/class/gpio/gpio59/value"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  rootFiles: [
    {
      id: "hw-ctrl_demo.md",
      label: "Demo 指令",
      groups: [
        {
          name: "Serial Quick Test",
          actions: [
            {
              name: "AT",
              code: "AT"
            },
            {
              name: "AT+GMR",
              code: "AT+GMR"
            }
          ]
        },
        {
          name: "GPIO 範例",
          actions: [
            {
              name: "列出 GPIO",
              code: "ls /sys/class/gpio"
            }
          ]
        }
      ]
    }
  ]
};
