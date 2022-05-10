import React from 'react'

const NoteInList = (props) => {
    return(
  <div>{decodeURIComponent(props.record.params.Note)}</div>
)
}
export default NoteInList