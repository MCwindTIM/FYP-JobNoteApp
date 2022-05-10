import React from 'react'

const JobTitleInList = (props) => {
    return(
  <div>{decodeURIComponent(props.record.title)}</div>
)
}
export default JobTitleInList