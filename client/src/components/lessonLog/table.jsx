import React, { useContext, memo } from 'react'
import { RoomInfoContext } from '../../Context'
import moment from 'moment'
import { GradeInput } from '../core/Input'
import Icon from '../core/Icon'
import style from './style.module.scss'
import { motion } from 'framer-motion'

const today = 1639958400000

const Table = ({ lessonDays, start, end, openModal }) => {
  const { isTeacher, me, classmates } = useContext(RoomInfoContext)
  const students = isTeacher ? [ ...classmates ] : [ me, ...classmates ]

  return (
    <motion.div className={style.table} layout>
      <div className={style.thead}>
        <div className={style.logTitle}/>
        {lessonDays
          .filter(({ interval }) => interval >= start && interval <= end)
          .map(({ interval }, key) => {
            const weekDay = moment(interval).format('ddd')
            const day = moment(interval).format('DD')

            return (
              <div className={style.titles} key={key}>
                <span className={style.weekDay}>{weekDay}</span>
                <span className={style.day}>{day}</span>
              </div>
            )
          })}
      </div>
      <div className={style.tbody}>
        {students &&
          students.map(({ name, surname, img, grades }, index) => (
            <div className={style.row} key={index}>
              <div className={style.studentInfo}>
                <div className={style.studentPhoto}>
                  {img ? (
                    <img src={img} alt={name}/>
                  ) : (
                    <Icon name="default_profile_small" width={40} height={40}/>
                  )}
                </div>
                <span
                  className={style.studentName}
                  style={index === 0 ? { boxShadow: 'none' } : {}}
                >
                  {name + ' ' + surname}
                </span>
              </div>
              {grades
                .filter(({ interval }) => interval >= start && interval <= end)
                .map(({ grade, interval, comment }, key) => {
                  return (
                    <div
                      className={
                        today === interval
                          ? index === 0
                            ? style.todaysAtomsTop
                            : index === students.length - 1
                              ? style.todaysAtomsBottom
                              : style.todaysAtoms
                          : style.atoms
                      }
                      style={
                        index === 0
                          ? key === 0
                            ? { boxShadow: 'none' }
                            : { boxShadow: 'inset 1px 0px 0px #e7e7e7' }
                          : key === 0
                            ? { boxShadow: 'inset 0px 1px 0px #e7e7e7' }
                            : {}
                      }
                      key={key}
                    >
                      <GradeInput
                        {...{
                          isTeacher: isTeacher && today === interval,
                          grade,
                          comment,
                          openModal,
                        }}
                        key={key}
                      />
                    </div>
                  )
                })}
            </div>
          ))}
      </div>
    </motion.div>
  )
}

export default memo(Table)
