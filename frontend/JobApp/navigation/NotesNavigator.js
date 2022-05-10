import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Screens
import NotesListScreen from "./screens/NotesListScreen";
import CreateNoteScreen from "./screens/CreateNoteScreen";
import NoteDetailsScreen from "./screens/NoteDetailsScreen";

const Stack = createStackNavigator();

//Screen names
const noteListName = "Notes List";
const createNoteName = "Create Note";
const noteDetailsName = "Note Details";

const NotesListStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name={noteListName} component={NotesListScreen} />
            <Stack.Screen name={createNoteName} component={CreateNoteScreen} />
            <Stack.Screen
                name={noteDetailsName}
                component={NoteDetailsScreen}
            />
        </Stack.Navigator>
    );
};

export { NotesListStackNavigator };
