import styles from '../styles/Validate.module.css'
import { useState, useRef } from 'react'
import { toast, Zoom } from 'react-toastify'
import { useSession } from 'next-auth/react'

export default function Validate() {
  const [file, setFile] = useState()
  const [validatedEmailsJson, setValidatedEmailsJson] = useState([])
  const [allEmailExportExt, setAllEmailExportExt] = useState('txt')
  const [onlyValidExportExt, setOnlyValidExportExt] = useState('txt')
  const [onlyFakeExportExt, setOnlyFakeExportExt] = useState('txt')
  const toastId = useRef(null)
  const [oneEmail, setOneEmail] = useState('')
  const { data: session } = useSession()

  const onExported = async (resData) => {
    let dbDataRaw = await fetch(`/api/getExportData-api`, {
      method: 'POST',
      body: JSON.stringify({ id: resData.dataId }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    let data = await dbDataRaw.json()
    if (data.message) {
      toast.update(toastId.current, {
        render: data.message,
        type: toast.TYPE.ERROR,
        autoClose: 2000,
        transition: Zoom,
      })
      return
    }
    let dbData = data.dbData

    document.getElementsByClassName('outputFile')[0].innerHTML = `
        <div style="padding: 0px 15px 10px 15px" className="downloadFile">
        <center style="word-break: break-all; padding: 10px"><em>validated_emails_${
          resData.dataId
        }</em></center>
          <span style="display: block"><strong>Click one the bellow button to download !!</strong></span>
          <a href="${
            resData.dataType + dbData.string_data
          }" download="validated_emails_${resData.dataId}">
            <button style="padding: 8px 10px">Download</button>
          </a>
        </div>
        `
    toast.update(toastId.current, {
      render: `File exportation done.`,
      type: toast.TYPE.SUCCESS,
      autoClose: 2000,
      transition: Zoom,
    })
  }

  let exportToFIle = async (e, exportFileCategory) => {
    e.stopPropagation()
    e.preventDefault()
    let exportExtension
    let emailsJson

    if (exportFileCategory == 'valid') {
      exportExtension = onlyValidExportExt
      emailsJson = validatedEmailsJson.validMails
    }
    if (exportFileCategory == 'fake') {
      exportExtension = onlyFakeExportExt
      emailsJson = validatedEmailsJson.fakeMails
    }
    if (exportFileCategory == 'all') {
      exportExtension = allEmailExportExt
      emailsJson = validatedEmailsJson
    }

    if (onlyValidExportExt | onlyFakeExportExt | allEmailExportExt) {
      toast.error('Please select an export file type !!', {
        toastId: 'error',
        transition: Zoom,
      })
      return
    }
    if (
      !emailsJson?.length &&
      !emailsJson?.validMails?.length &&
      !emailsJson?.fakeMails?.length
    ) {
      toast.error("Can't export an empty file !!", {
        toastId: 'error',
        transition: Zoom,
      })
      return
    }

    toastId.current = toast.info('Processing...', {
      autoClose: false,
      transition: Zoom,
    })

    let raw_data = await fetch(`/api/export-api`, {
      method: 'POST',
      body: JSON.stringify({
        emailsJson,
        exportExtension,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    let returnedData = await raw_data.json()
    if (returnedData.message) throw new Error(returnedData.message)

    onExported(returnedData)

    setAllEmailExportExt('txt')
    setOnlyValidExportExt('txt')
    setOnlyFakeExportExt('txt')
  }

  const fileSubmit = async (e) => {
    try {
      e.preventDefault()
      if (!file) {
        toast.error('Please choose a file !!', {
          toastId: 'error',
          transition: Zoom,
        })
        return
      }

      if (
        file.type != 'text/plain' &&
        file.type !=
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
        file.type != 'application/msexcel' &&
        file.type != 'text/csv'
      ) {
        toast.error('File type not supported !!', {
          autoClose: 2000,
          toastId: 'error',
          transition: Zoom,
        })
        toast.info('Valid file types: .txt .csv .xls .xlsx', {
          toastId: 'info',
          transition: Zoom,
        })
        return
      }

      toastId.current = toast.info('Processing...', {
        autoClose: false,
        transition: Zoom,
      })

      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async function (evt) {
        const fileBase64 = evt.target.result.split(',')[1]
        let rawdata = await fetch(`/api/validate-api`, {
          method: 'POST',
          body: JSON.stringify({
            fileBase64,
            filename: file.name,
            id: session.user.id,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        let data = await rawdata.json()
        if (data.message) throw new Error(data.message)
        setValidatedEmailsJson(data.emailsJson)
        toast.update(toastId.current, {
          render: 'Email validation done.',
          type: toast.TYPE.SUCCESS,
          autoClose: 2000,
          transition: Zoom,
        })
      }
      setFile(null)
      document.getElementById('fileInputForm').reset()
    } catch (e) {
      toast.update(toastId.current, {
        render: e.message,
        type: toast.TYPE.ERROR,
        autoClose: 2000,
        transition: Zoom,
      })
      return
    }
  }
  const oneMailSubmit = async (e) => {
    try {
      e.preventDefault()
      if (!oneEmail) {
        toast.error('Please enter an email !!', {
          toastId: 'error',
          transition: Zoom,
        })
        return
      }
      if (oneEmail.length > 150) {
        toast.error('Please enter an email less than 150 characters !!', {
          toastId: 'error',
          transition: Zoom,
        })
        return
      }
      let res = await fetch(`/api/validateOne-api`, {
        method: 'POST',
        body: JSON.stringify({ oneEmail, id: session.user.id }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      let resJson = await res.json()
      if (resJson.message) throw new Error(resJson.message)
      document.getElementsByClassName('output')[0].innerHTML = `
  <div style="padding: 0px 15px 10px 15px">
  <center style="word-break: break-all; padding: 10px"><em>${oneEmail}</em></center>
    <div>
      <span style="display: block"><strong>Typo: </strong>${
        resJson.typo ? 'Correct' : 'Wrong'
      }</span>
      <span style="display: block"><strong>Disposable: </strong>${
        resJson.disposable ? 'Yes' : 'No'
      }</span>
      <span style="display: block"><strong>MX records: </strong>${
        resJson.mx ? 'Found' : 'Not found'
      }</span>
      <span style="display: block"><strong>Smtp: </strong>${
        resJson.smtp ? 'Found' : 'Not found'
      }</span>
      <br />
      <span style="display: block"><strong>Email: </strong>${
        (resJson.smtp && resJson.mx && !resJson.disposable && resJson.typo) ? 'Valid' : 'Invalid'
      }</span>
    </div>
  </div>
  `
      setOneEmail('')
    } catch (e) {
      toast.error(e.message, { toastId: 'error', transition: Zoom })
      return
    }
  }

  return (
    <div className={styles.main}>
      <form
        onSubmit={oneMailSubmit}
        style={{ width: '300px' }}
        className={styles.fileForm}
      >
        <label htmlFor="one_email">
          <strong>Validate one email</strong>
        </label>
        <br />
        <input
          required
          value={oneEmail}
          style={{ width: '220px', padding: '5px', margin: '5px' }}
          onChange={(e) => setOneEmail(e.target.value)}
          type="text"
          name="one_email"
          id="one_email"
        />
        <br />
        <input
          style={{ padding: '8px 10px', fontWeight: 'bold' }}
          value="Validate One"
          type="submit"
        />
      </form>
      <div className={`${styles.outputFileDiv} output`}>
        <p className={`${styles.noFileP} isNoOutput`}>
          <strong>No result to show !!</strong>
        </p>
      </div>
      <br />
      <form
        id="fileInputForm"
        className={styles.fileForm}
        onSubmit={fileSubmit}
      >
        <label htmlFor="file">
          <strong>Emails file</strong>
        </label>
        <br />
        <input
          required
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          name="emailsFile"
          id="file"
        />
        <br />
        <input
          style={{ padding: '8px 10px', fontWeight: 'bold' }}
          value="Validate"
          type="submit"
        />
      </form>
      <div className={`${styles.outputFileDiv} difResults`}>
        {validatedEmailsJson.validMails && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
              padding: '20px',
            }}
            className="exportForms"
          >
            <form onSubmit={(e) => exportToFIle(e, 'valid')}>
              <div className="onlyValid">
                <strong>
                  <p>Valid ({validatedEmailsJson.validMails.length})</p>
                </strong>

                <select
                  style={{ padding: '5px' }}
                  onChange={(e) => setOnlyValidExportExt(e.target.value)}
                >
                  <option value="txt">.txt</option>
                  <option value="xlsx">.xlsx</option>
                  <option value="xls">.xls</option>
                  <option value="csv">.csv</option>
                </select>
                <br />
                {validatedEmailsJson.validMails.length ? (
                  <input
                    style={{ padding: '8px 10px', fontWeight: 'bold' }}
                    value="Export"
                    type="submit"
                  />
                ) : (
                  <input
                    style={{ padding: '8px 10px', fontWeight: 'bold' }}
                    value="Can't Export"
                    type="submit"
                    disabled
                  />
                )}
              </div>
            </form>
            <form onSubmit={(e) => exportToFIle(e, 'fake')}>
              <div className="onlyFake">
                <strong>
                  <p>Fake ({validatedEmailsJson.fakeMails.length})</p>
                </strong>
                <select
                  style={{ padding: '5px' }}
                  onChange={(e) => setOnlyFakeExportExt(e.target.value)}
                >
                  <option value="txt">.txt</option>
                  <option value="xlsx">.xlsx</option>
                  <option value="xls">.xls</option>
                  <option value="csv">.csv</option>
                </select>
                <br />
                {validatedEmailsJson.fakeMails.length ? (
                  <input
                    style={{ padding: '8px 10px', fontWeight: 'bold' }}
                    value="Export"
                    type="submit"
                  />
                ) : (
                  <input
                    style={{ padding: '8px 10px', fontWeight: 'bold' }}
                    value="Can't Export"
                    type="submit"
                    disabled
                  />
                )}
              </div>
            </form>
            <form onSubmit={(e) => exportToFIle(e, 'all')}>
              <div className="allEmail">
                <strong>
                  <p>
                    All (
                    {validatedEmailsJson.validMails.length +
                      validatedEmailsJson.fakeMails.length}
                    )
                  </p>
                </strong>
                <select
                  style={{ padding: '5px' }}
                  onChange={(e) => setAllEmailExportExt(e.target.value)}
                >
                  <option value="txt">.txt</option>
                  <option value="xlsx">.xlsx</option>
                  <option value="xls">.xls</option>
                  <option value="csv">.csv</option>
                </select>
                <br />
                {validatedEmailsJson.validMails.length +
                validatedEmailsJson.fakeMails.length ? (
                  <input
                    style={{ padding: '8px 10px', fontWeight: 'bold' }}
                    value="Export"
                    type="submit"
                  />
                ) : (
                  <input
                    style={{ padding: '8px 10px', fontWeight: 'bold' }}
                    value="Can't Export"
                    type="submit"
                    disabled
                  />
                )}
              </div>
            </form>
          </div>
        )}
        {!validatedEmailsJson.validMails && (
          <p className={`${styles.noFileP} isNoOutput`}>
            <strong>No file to export !!</strong>
          </p>
        )}
      </div>
      <div className={`${styles.outputFileDiv} outputFile`}>
        <p className={`${styles.noFileP} isNoOutputFile`}>
          <strong>No file to download !!</strong>
        </p>
      </div>
    </div>
  )
}
