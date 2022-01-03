import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    indicator: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    item_container: {
        flex: 1,
        flexDirection: "row",
        padding: 10,
        alignItems: "center",
    },
    item_image: {
        width: 60,
        height: 60,
    },
    item_text: {
        fontSize: 14,
        fontWeight: "bold"
    },
    item_divider: {
        height: 0.5,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    info_header: {
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    info_image: {
        width: 120,
        height: 120,
    },
    info_text: {
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 5,
    },
    info_list_header: {
        borderBottomWidth: 0.5,
        borderTopWidth: 0.5,
        borderColor: "rgba(0,0,0,0.5)",
    },
    info_list_title: {
        fontSize: 16,
        fontWeight: "bold",
        padding: 10,
    },
});

export default Styles;