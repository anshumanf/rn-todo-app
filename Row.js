import React, { Component } from "react";
import {
  View,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

class Row extends Component {
  render() {
    const
      {complete} = this.props,
      textComponent = (
        <TouchableOpacity
          style = {styles.textWrap}
          onLongPress = {() => this.props.onToggleEdit(true)}
        >
          <Text style={[styles.text, complete && styles.complete]}>{this.props.text}</Text>
        </TouchableOpacity>
      ),
      removeButton = (
        <TouchableOpacity onPress={this.props.onRemove}>
          <Text style={styles.destroy}>X</Text>
        </TouchableOpacity>
      ),
      editingComponent = (
        <View style={styles.textWrap}>
          <TextInput
            onChangeText = {this.props.onUpdate}
            autoFocus    = {true}
            value        = {this.props.text}
            style        = {styles.input}
            multiline    = {true}
          />
        </View>
      );
      doneButton = (
        <TouchableOpacity
          style = {styles.done}
          onPress={() => {console.log('done'); this.props.onToggleEdit(false)}}
        >
          <Text style={styles.doneText}>Save</Text>
        </TouchableOpacity>
      );
    return (
      <View style={styles.container}>
        <Switch
          value={complete}
          onValueChange={this.props.onComplete}
        />
        {this.props.editing ?
          editingComponent :
          textComponent
        }
        {this.props.editing ?
          doneButton :
          removeButton
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      padding: 10,
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    input: {
      height: 100,
      flex: 1,
      fontSize: 24,
      padding: 0,
      color: '#4d4d4d',
    },
    textWrap: {
      flex: 1,
      marginHorizontal: 10,
    },
    done: {
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#7be290',
      padding: 7,
    },
    doneText: {
      color: '#4d4d4d',
      fontSize: 20,
    },
    text: {
      fontSize: 24,
      color: '#4d4d4d',
    },
    complete: {
      textDecorationLine: 'line-through',
    },
    destroy: {
      fontSize: 20,
      color: '#cc9a9a',
    },
});

export default Row;