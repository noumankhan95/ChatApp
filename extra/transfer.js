const sendRecording = useCallback(async () => {
  console.log("Stopping and sending recording..");
  try {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    let updatedRecordings = [...Allrecordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    updatedRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI(),
    });
    setAllrecordings(updatedRecordings);
    const vform = new FormData();
    vform.append("voice", {
      uri: recording.getURI(),
      name: "voice.m4a",
      type: "audio/mp4",
    });
    const r = await fetch("https://tarrhoon.com/Api/chatDetails", {
      method: "POST",
      body: vform,
    });
    const d = await r.json();
    console.log(d);
    // const r = await fetch("http://192.168.10.20:3001/file", {
    //   method: "post",
    //   body: vform,
    // });
    // const body = await r.json();
  } catch (e) {
    console.log("stop and send recording", e);
    Alert.alert(
      "Error",
      "Couldnt Send your Voice Message .Please Try Again Later."
    );
  }
}, [recording]);

//document
const sendDocumentHandler = useCallback(async () => {
  try {
    const dform = new FormData();
    dform.append("document", {
      uri: document.uri,
      name: document.name,
      type: document.mimeType,
    });
    const r = await fetch("https://tarrhoon.com/Api/chatDetails", {
      method: "POST",
      body: dform,
    });
    const d = await r.json();
  } catch (e) {
    console.log("Document upload Error", e);
    Alert.alert("Error", "Couldnt Send Your File,Please Try Again");
  } finally {
    setdocument((p) => undefined);
  }
}, [document]);
