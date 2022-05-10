import React from 'react'

const UserAvatarInList = (props) => {
    let image = props.record.params.avatar ? `data:image/png;base64, ${props.record.params.avatar}` :  `http://223.16.12.55/defaultAvatar`
    const style = {
        borderRadius: '50%',
      };
    return(
  <div><img src={image} width="50" style={style}/></div>
)
}
export default UserAvatarInList