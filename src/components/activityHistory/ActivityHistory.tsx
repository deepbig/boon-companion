import React, { useState, forwardRef, useEffect } from 'react';
// import { useAppSelector, useAppDispatch } from 'hooks';
import { Box, BoxProps, Tooltip } from '@mui/material';
import styles from './ActivityHistory.module.css';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getActivities, setActivityList } from 'modules/activity';
import * as activity from 'db/repository/activity';
import { ActivityData } from 'types';
import { getSelectedInterest } from 'modules/interests';
// import { UserActivityData } from 'types';
// import { getActivities } from 'db/repository/activity';

const Item = forwardRef((props: BoxProps, ref) => {
  const { sx, ...other } = props;

  return (
    <Box
      sx={{
        borderRadius: 0.7,
        ...sx,
      }}
      ref={ref}
      {...other}
    />
  );
});

function ActivityHistory() {
  const activities = useAppSelector(getActivities);
  const selectedInterest = useAppSelector(getSelectedInterest);
  const dispatch = useAppDispatch();
  const [selectedYear] = useState(null); // setSelectedYear는 filter 기능 추가 후 적용.

  useEffect(() => {
    if (selectedInterest) {
      fetchActivities(selectedInterest);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInterest]);

  const fetchActivities = async (selectedInterest: string) => {
    const _activities = await activity.current(selectedInterest);
    dispatch(setActivityList(_activities));
  };

  const drawBoxes = (activities: ActivityData[]) => {
    let rows = [];
    const end = selectedYear ? new Date(selectedYear + 1, 0, 1) : new Date();
    const start = selectedYear
      ? new Date(selectedYear, 0, 1)
      : new Date(end.getFullYear() - 1, end.getMonth(), end.getDate());
    for (let day = 0; day < start.getDay(); day++) {
      rows.push(<Item key={day - 7}></Item>);
    }
    let index: number = -1;
    let count: number = 0;
    for (let d = start; d < end; d.setDate(d.getDate() + 1)) {
      // date이 같을 경우
      if (
        activities[count]?.date?.toDate().getTime() >= d.getTime() &&
        activities[count]?.date?.toDate().getTime() < d.getTime() + 86400000
      ) {
        let duration = 0;
        let activityCount = 0;
        let description = '';
        let date = activities[count].date.toDate().toDateString();
        do {
          activityCount++;
          description += activities[count].description
            ? `${activities[count].description}\n`
            : '';
          duration += activities[count++].duration;
        } while (
          activities[count]?.date?.toDate().getTime() >= d.getTime() &&
          activities[count]?.date?.toDate().getTime() < d.getTime() + 86400000
        );

        rows.push(
          <Tooltip
            key={`tooltip-${++index}`}
            title={
              <span style={{ whiteSpace: 'pre-line' }}>
                {date +
                  `\nNote: ${description} Duration: ${duration} \nActivity Count: ${activityCount}`}
              </span>
            }
            placement='top'
            followCursor
            arrow
          >
            <Item
              key={++index}
              data-toggle='tooltip'
              data-placement='bottom'
              data-animation='false'
              data-level={duration / 60 <= 4 ? Math.ceil(duration / 60) : 4}
            />
          </Tooltip>
        );
      } else {
        rows.push(
          <Tooltip
            key={`tooltip-${++index}`}
            title={d.toDateString()}
            placement='top'
            followCursor
            arrow
          >
            <Item
              key={++index}
              data-toggle='tooltip'
              data-placement='bottom'
              data-animation='false'
              data-level={0}
            />
          </Tooltip>
        );
      }
    }
    return rows;
  };

  return (
    <div>
      <div className={styles.graph}>
        <ul className={styles.months}>
          <li>Jan</li>
          <li>Feb</li>
          <li>Mar</li>
          <li>Apr</li>
          <li>May</li>
          <li>Jun</li>
          <li>Jul</li>
          <li>Aug</li>
          <li>Sep</li>
          <li>Oct</li>
          <li>Nov</li>
          <li>Dec</li>
        </ul>
        <ul className={styles.days}>
          <li>Sun</li>
          <li>Mon</li>
          <li>Tue</li>
          <li>Wed</li>
          <li>Thu</li>
          <li>Fri</li>
          <li>Sat</li>
        </ul>
        <ul className={styles.squares}>{drawBoxes(activities)}</ul>
      </div>
      <Box sx={{ display: 'flex', flexDirection: 'row-reverse', pt: 2, pr: 1 }}>
        More
        <ul className={styles.explain}>
          <Item key={1000} data-level={0} />
          <Item key={1001} data-level={1} />
          <Item key={1002} data-level={2} />
          <Item key={1003} data-level={3} />
          <Item key={1004} data-level={4} />
        </ul>
        Less
      </Box>
    </div>
  );
}

export default ActivityHistory;
