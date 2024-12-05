import { useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';

const Dropzone = ({ onDrop }) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: [NativeTypes.FILE],
    drop: (item) => {
      onDrop(item.files);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = canDrop && isOver;

  return (
    <div
      ref={drop}
      style={{
        width: '100%',
        height: '300px',
        border: '2px dashed #ccc',
        borderRadius: '5px',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: isActive ? '#f7f7f7' : 'transparent',
      }}
    >
      {isActive ? 'Drop here' : 'Drag and drop files here or click to select'}
    </div>
  );
};

export default Dropzone;
