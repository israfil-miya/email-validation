import styles from '../styles/Home.module.css'
import { useState, useRef, useEffect } from 'react'
import { toast, Zoom } from 'react-toastify'
import Pusher from 'pusher-js'
const pusher = new Pusher(process.env.NEXT_PUBLIC_key, {
  cluster: process.env.NEXT_PUBLIC_cluster,
  useTLS: true
})


export default function Home() {
  const [file, setFile] = useState()
  const [exportExt, setExportExt] = useState("txt")
  const toastId = useRef(null);
  const [oneEmail, setOneEmail] = useState("")

  const channel = pusher.subscribe('emails-validation')
  const onValidated = async (data) => {
    await fetch(`/api/export-api`, {
      method: 'POST',
      body: JSON.stringify({ emailsJson: data, exportExtension: exportExt }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  const onExported = (resData) => {

    document.getElementsByClassName("outputFile")[0].innerHTML = `
        <div style="padding: 0px 15px 10px 15px" className="downloadFile">
          <p><strong>Click one the bellow button to download !!</strong></p>
          <a href="${resData.dataType + resData.exportFileBase64}" download="validated_emails">
            <button style="padding: 8px 10px">Download</button>
          </a>
        </div>
        `
    toast.update(toastId.current, {
      render: `Validated emails and exported as a ${exportExt} file.`,
      type: toast.TYPE.SUCCESS,
      autoClose: 2000,
      transition: Zoom
    });

  }


  useEffect(() => {
    channel.bind('validated', async data => {
      onValidated(await data)
    })
    channel.bind('exported', async data => {
      onExported(await data)
    })
  }, [])

  const fileSubmit = async (e) => {
    e.preventDefault()
    if (!file) { toast.error("Please choose a file !!", { toastId: "error", transition: Zoom }); return }

    if (file.type != "text/plain")
      if (file.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        if (file.type != "application/msexcel")
          if (file.type != "text/csv") {
            toast.error("File type not supported !!", { autoClose: 1000, toastId: "error", transition: Zoom });
            toast.info("Valid file types: .txt .csv .xls .xlsx", { toastId: "info", transition: Zoom });
            return;
          }



    toastId.current = toast.info('Processing...', { autoClose: false, transition: Zoom });

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async function (evt) {
      const fileBase64 = evt.target.result.split(',')[1];
      await fetch(`/api/validate-api`, {
        method: 'POST',
        body: JSON.stringify({ fileBase64, filename: file.name }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
    setFile(null)
    setExportExt("txt")
    document.getElementById("fileInputForm").reset() // reset form

  }
  const oneMailSubmit = async (e) => {
    e.preventDefault()
    if (!oneEmail) { toast.error("Please enter an email !!", { toastId: "error", transition: Zoom }); return }
    if (oneEmail.length >= 150) { toast.error("Please enter an email less than 150 characters !!", { toastId: "error", transition: Zoom }); return }
    let res = await fetch(`/api/validate-api`, {
      method: 'POST',
      body: JSON.stringify({ oneEmail }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    let resJson = await res.json()
    document.getElementsByClassName("output")[0].innerHTML = `
  <div style="padding: 0px 15px 10px 15px">
  <center style="word-break: break-all; padding: 10px"><em>${oneEmail}</em></center>
    <div>
      <span style="display: block"><strong>Is Email: </strong>${resJson.wellFormed ? "Yes" : "No"}</span>
      <span style="display: block"><strong>Valid Domain: </strong>${resJson.validDomain ? "Yes" : "No"}</span>
      <span style="display: block"><strong>Valid Mailbox: </strong>${resJson.validMailbox ? "Yes" : "No"}</span>
    </div>
  </div>
  `
    setOneEmail("")
  }
  return (
    <div className={styles.main}>
      <form onSubmit={oneMailSubmit} style={{ width: "300px" }} className={styles.fileForm} >
        <label htmlFor='one_email'><strong>Validate one email</strong></label><br />
        <input required value={oneEmail} style={{ width: "220px", padding: "5px", margin: "5px" }} onChange={(e) => setOneEmail(e.target.value)} type="text" name="one_email" id='one_email' /><br />
        <input style={{ padding: "8px 10px", fontWeight: "bold" }} value="Validate One" type="submit" />
      </form>
      <div className={`${styles.outputFileDiv} output`}>
        <p className={`${styles.noFileP} isNoOutput`}><strong>No result to show !!</strong></p>
      </div>
      <br />
      <form id="fileInputForm" className={styles.fileForm} onSubmit={fileSubmit}>
        <label htmlFor='ext'><strong>Select export extension</strong></label><br />
        <select className={styles.extSelection} onChange={e => setExportExt(e.target.value)} name="ext" id="ext">
          <option value="txt">.txt</option>
          <option value="xlsx">.xlsx</option>
          <option value="xls">.xls</option>
          <option value="csv">.csv</option>
        </select>
        <br />
        <label htmlFor='file'><strong>Emails file</strong></label><br />
        <input required onChange={(e) => setFile(e.target.files[0])} type="file" name="emailsFile" id='file' /><br />
        <input style={{ padding: "8px 10px", fontWeight: "bold" }} value="Validate" type="submit" />
      </form>
      <div className={`${styles.outputFileDiv} outputFile`}>
        <p className={`${styles.noFileP} isNoOutputFile`}><strong>No file to download !!</strong></p>
      </div>
    </div>
  )
}
