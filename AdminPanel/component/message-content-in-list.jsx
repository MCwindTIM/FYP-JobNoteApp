import React from 'react'

const MessageContentInList = (props) => {
    return(
  <div>{decodeURIComponent(props.record.params.content)}</div>
)
}
export default MessageContentInList