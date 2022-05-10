import React from 'react'

const JobDetailInList = (props) => {
    return(
  <div>{decodeURIComponent(props.record.params.Details)}</div>
)
}
export default JobDetailInList