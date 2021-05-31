import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import {formatTime} from '../../utils/timeStrings';
import {minutesBetween} from '../../utils/dateTime';
import {DataTable} from 'react-native-paper';

function EpgDataTable({programs, channels}) {
  // console.log('programes', programs);
  const [startTime, setStartTime] = useState();
  const [programGridPercent] = useState(90);
  const [times, setTimes] = useState([]);

  useEffect(() => {
    let start = new Date();
    let minutes = 0;
    if (start.getMinutes() >= 30) {
      minutes = 30;
    }
    start.setMinutes(minutes, 0, 0);
    setStartTime(start);
  }, [programs]);

  useEffect(() => {
    if (startTime) {
      let utcTime = startTime.getTime();
      let tArrar = [];
      for (let i = 0; i < 4; i++) {
        let tempTime = new Date(utcTime);
        tArrar.push(formatTime(tempTime));
        utcTime += 1800000;
      }
      setTimes(tArrar);
    }
  }, [startTime]);
  const createChannelProgramRow = (channel, programs) => {
    let cells = [];
    let counter = 0;
    let percentUsed = 0;
    let gridEnd = new Date(startTime.getTime());
    let guideDuration = 2;
    gridEnd.setHours(gridEnd.getHours() + guideDuration);
    cells.push(
      <DataTable.Cell>
        <View style={styles.channelBody}>
          <Text style={styles.cellText}>{channel.channel_number}</Text>
          <Image style={styles.icon} source={{uri: channel.logo_url}} />
        </View>
      </DataTable.Cell>,
    );
    if (programs && programs.length > 0) {
      programs.forEach((program) => {
        if (percentUsed < programGridPercent) {
          counter += 1;

          let start = new Date(program.start_time);
          let end = new Date(program.end_time);
          let effective_start = new Date(start.getTime());
          let effective_end = new Date(end.getTime());

          if (start < startTime) {
            effective_start = new Date(startTime.getTime());
          }
          if (end > gridEnd) {
            effective_end = new Date(gridEnd.getTime());
          }

          let minutesFromStart = minutesBetween(startTime, effective_end);
          let percent = 0;

          if (minutesFromStart % 15 === 0) {
            percent =
              (minutesFromStart / 15) * (programGridPercent / 8) - percentUsed;
          } else {
            let length = minutesBetween(effective_start, effective_end);
            percent = Math.round((length / 120) * programGridPercent);
          }

          if (percent + percentUsed > programGridPercent) {
            percent = programGridPercent - percentUsed;
          }
          percentUsed += percent;
          if (counter === programs.length && percentUsed < programGridPercent) {
            percent += programGridPercent - percentUsed;
            percentUsed = programGridPercent;
          }

          if (percent > 0) {
            cells.push(
              createProgramColumn(
                percent,
                program.title,
                start,
                end,
                program,
                channel,
              ),
            );
          }
        }
      });
    } else {
      // fill in blank program here
    }
    return cells;
  };
  const createProgramColumn = (
    width,
    title,
    startTime,
    endTime,
    program,
    channel,
  ) => {
    let program_id = program.program_id;
    program.channel_number = channel.channel_number;
    return (
      <DataTable.Cell style={styles.cell}>
        <View style={{justifyContent: 'center'}}>
          <Text style={styles.cellText}>{title}</Text>

          <Text style={styles.cellText}>
            {formatTime(startTime)} - {formatTime(endTime)}
          </Text>
        </View>
      </DataTable.Cell>
    );
  };

  const createChannelProgramRows = () => {
    let rows = [];

    if (channels && channels?.length > 0) {
      channels.forEach((channel) => {
        let cPrograms = null;
        if (programs?.length > 0) {
          cPrograms = programs.filter(
            (program) => program.channel_id === channel.channel_id,
          );
        }
        rows.push(
          <DataTable.Row style={styles.tableRow}>
            {createChannelProgramRow(channel, cPrograms)}
          </DataTable.Row>,
        );
      });
    } else {
      rows.push(
        <DataTable.Row style={styles.tableRow}>
          <DataTable.Cell></DataTable.Cell>
        </DataTable.Row>,
      );
    }
    return rows;
  };

  return (
    <View>
      <DataTable.Header style={styles.tableHeader}>
        <DataTable.Title></DataTable.Title>
        <DataTable.Title style={styles.tableTitle}>
          <Text style={styles.tableTitleText}>{times[0]}</Text>
        </DataTable.Title>
        <DataTable.Title style={styles.tableTitle}>
          <Text style={styles.tableTitleText}>{times[1]}</Text>
        </DataTable.Title>
        <DataTable.Title style={styles.tableTitle}>
          <Text style={styles.tableTitleText}>{times[2]}</Text>
        </DataTable.Title>
        <DataTable.Title style={styles.tableTitle}>
          <Text style={styles.tableTitleText}>{times[3]}</Text>
        </DataTable.Title>
      </DataTable.Header>
      <ScrollView horizontal>
        <ScrollView vertical>
          {/* <DataTable.Row>{createChannelProgramRows()}</DataTable.Row> */}
          {createChannelProgramRows()}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    justifyContent: 'center',
    borderLeftWidth: 2,
    borderColor: '#dfdfdf',
    width: 200,
  },
  channelBody: {
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  icon: {
    width: 40,
    height: 40,
    marginHorizontal: 20,
  },
  tableHeader: {
    backgroundColor: 'black',
  },
  tableTitle: {
    borderLeftWidth: 2,
    justifyContent: 'center',
    borderColor: 'white',
    width: 400,
  },
  tableTitleText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  tableBody: {
    backgroundColor: '#555555',
  },
  tableRow: {
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: '#666666',
    height: 60,
  },
  cellText: {
    color: 'white',
  },
});
export default EpgDataTable;
