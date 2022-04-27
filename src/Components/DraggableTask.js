import Task from "./Task"

const DraggableTask = (props) => {
    const onDragStart = (event) => {
        event.dataTransfer.setData("TaskId", props.task.id);
    }
    return(<div draggable="true" style={{width: "min-content"}} onDragStart={onDragStart}><Task {...props}/></div>)
}

export default DraggableTask;