import React from 'react'

const UserUsernameInList = (props) => {
    return(
  <div>{decodeURIComponent(props.record.params.username)}</div>
)
}
export default UserUsernameInList