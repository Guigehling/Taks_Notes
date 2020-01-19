import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import 'moment/locale/pt-br';

import todayImage from '../../assets/imgs/today.jpg';
import commonStyle from '../commonStyles';

import Task from '../components/Task';

export default class Agenda extends Component {
  state = {
    tasks: [
      {
        id: Math.random(),
        desc: 'Comprar o curso de react-native',
        estimateAt: new Date(),
        doneAt: new Date(),
      },
      {
        id: Math.random(),
        desc: 'Concluir o curso',
        estimateAt: new Date(),
        doneAt: null,
      },
    ],
    visibleTasks: [],
    showDoneTasks: true,
  };

  filterTasks = () => {
    let visibleTasks = null;
    if (this.state.showDoneTasks) {
      visibleTasks = [...this.state.tasks];
    } else {
      const pending = task => task.doneAt === null;
      visibleTasks = this.state.tasks.filter(pending);
    }
    this.setState({visibleTasks});
  };

  toggleFilter = () => {
    this.setState({showDoneTasks: !this.state.showDoneTasks}, this.filterTasks);
  };

  componentDidMount = () => {
    this.filterTasks();
  };

  toggleTask = id => {
    //Percorrendo lista com Map
    const tasks = this.state.tasks.map(task => {
      if (task.id === id) {
        task = {...task};
        task.doneAt = task.doneAt ? null : new Date();
      }
      return task;
    });

    //Percorrendo lista com ForEach
    // const tasks = [...this.state.tasks];
    // tasks.forEach(task => {
    //   if (task.id === id) {
    //     task.doneAt = task.doneAt ? null : new Date();
    //   }
    // });

    this.setState({tasks}, this.filterTasks);
  };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={todayImage} style={styles.background}>
          <View style={styles.iconBar}>
            <TouchableOpacity onPress={this.toggleFilter}>
              <Icon
                name={this.state.showDoneTasks ? 'eye' : 'eye-slash'}
                size={20}
                color={commonStyle.colors.secondary}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.titleBar}>
            <Text style={styles.title}>Hoje</Text>
            <Text style={styles.subtitle}>
              {moment()
                .locale('pt-br')
                .format('ddd, D [de] MMMM')}
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.taskContainer}>
          <FlatList
            data={this.state.visibleTasks}
            keyExtractor={item => `${item.id}`}
            renderItem={({item}) => (
              <Task {...item} toggleTask={this.toggleTask} />
            )}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 3,
  },
  titleBar: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontFamily: commonStyle.fontFamily,
    color: commonStyle.colors.secondary,
    fontSize: 50,
    marginLeft: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: commonStyle.fontFamily,
    color: commonStyle.colors.secondary,
    fontSize: 20,
    marginLeft: 20,
    marginBottom: 30,
  },
  taskContainer: {
    flex: 7,
  },
  iconBar: {
    marginTop: Platform.OS === 'ios' ? 30 : 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});