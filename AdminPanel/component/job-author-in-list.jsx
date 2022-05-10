import React from 'react'

const JobAuthorInList = (props) => {
    return(
  <div>{decodeURIComponent(props.record.params.Author)}</div>
)
}
export default JobAuthorInList