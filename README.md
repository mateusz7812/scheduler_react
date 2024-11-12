# Scheduler Web App

Scheduler is a tool for IT administrators that enables remote execution of PowerShell commands on computers within a network. Its features include creating task templates, simultaneously executing task trees on multiple machines, and logging actions, which simplifies the management of the IT environment and increases administrative efficiency. The project can be especially useful in large IT environments where managing numerous computers requires automation and centralization of tasks.

Web App is a command centre of whole Scheduler system. It allows you on creating tasks, flows (trees of tasks), tracing flow runs and managing executors. Developed using React, GraphQL, Docker, nginx, Microsoft Authentication Library.

The Azure pipeline builds image and pushes it to repository at: https://hub.docker.com/repository/docker/mateusz7812/scheduler_react/general.

More information can be found in other projects related to the Scheduler app.

### Tasks tab
![obraz](https://github.com/user-attachments/assets/d7c3f28e-0813-4277-8a14-feaeb14eeaa0)

### Tasks previews
Tasks commands uses Powershell systax allowing on inserting evironment variables and combining commands.

![obraz](https://github.com/user-attachments/assets/f7f081b1-1f62-4c9f-9d31-dfc82e743dd1)

![obraz](https://github.com/user-attachments/assets/11042d4f-d451-4618-90b6-41cf53c7afcb)

### Flows tab
![obraz](https://github.com/user-attachments/assets/0c0ccdf3-582c-46ce-a100-c9d4e95d6245)

### Flow tab
Flow tab contains metadata about flow like name and desription, flow diagram and control panel to edit, run or view runs history.

![obraz](https://github.com/user-attachments/assets/f6f920da-da4d-45b7-bf6c-eaa1f76b16d2)

### Started flow tab
Flow tab show live updates about started flow with logs and task status indicators.

![obraz](https://github.com/user-attachments/assets/03532a8c-b7aa-4666-be88-fa5fb11db1a7)

### Editing flows
Sheduler supports parallel tasks and such complicated flows like the one below.
Editing flow involvs dragging tasks using a mouse and writing values for environment variables. 

![obraz](https://github.com/user-attachments/assets/a097c481-529d-4d87-bbe9-1816da84ef8b)

### Executors tab
![obraz](https://github.com/user-attachments/assets/c21f9015-ceee-4118-9aee-eb1e25d3ed9d)
