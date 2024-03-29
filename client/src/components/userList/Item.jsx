import React from 'react'
import defaultUser from '../../assets/img/defaultUser.png'
import Icon from '../core/Icon'
import style from './style.module.scss'

const Item = ({
                firsIconName,
                itemAudioStream,
                name,
                surname,
                isTeacher,
                userId,
              }) => {
  return (
    <div className={style.item}>
      <div className={style.container}>
        <div className={style.imgWrapper}>
          <img src={defaultUser} alt=""/>
        </div>
        <span>{`${name} ${surname}`}</span>
        {isTeacher && <span className={style.isTeacherText}>Teacher</span>}
      </div>
      <div className={style.accsessories}>
        <Icon name={firsIconName} width={16} height={16}/>
        {itemAudioStream ? (
          <Icon name="userlist_voice_on" width={16} height={16}/>
        ) : (
          <Icon name="userlist_voice_off" width={16} height={16}/>
        )}
      </div>
    </div>
  )
}

export default Item
