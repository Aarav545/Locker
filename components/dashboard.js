import { Badge, Card, Input, Button, Modal, Spacer, Textarea } from '@geist-ui/react'
import * as Icon from '@geist-ui/react-icons'
import { useEffect, useState } from 'react'
import styles from '../styles/dashboard.module.css'
import showdown, { Converter } from 'showdown'

export default function Dashboard ({ userData }) {
  const [rawData, setRawData] = useState([])
  const [notes, setNotes] = useState([])
  const [isNoteModalOpen, setNoteModalOpen] = useState(false)

  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [noteContentPreview, setNoteContentPreview] = useState('')

  useEffect(() => {
    const req = fetch('/api/notes', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...userData
      })
    })
    console.log('Running...')
    req.then(data => {
      data.text().then(response => {
        response = JSON.parse(response)
        setRawData(response)
      })
    })
  }, [userData])

  useEffect(() => {
    setNotes(rawData)
  }, [rawData])

  function search (event) {
    const query = (event.target.value).toLowerCase()

    setNotes(rawData.filter(note => (
      note.title.toLowerCase().includes(query) ||
      note.desc.toLowerCase().includes(query)
    //   || (note.tags.map(tag => (
    //     tag.toLowerCase().includes(query)
    //   ))).includes(true)
    )))
  }

  function markdownToHTML (data) {
    const converter = new showdown.Converter()
    return converter.makeHtml(data)
  }

  useEffect(() => {
    setNoteContentPreview(markdownToHTML(noteContent))
  }, [noteContent])

  function noteHanlder () {
    const title = noteTitle
    const desc = noteContent

    const req = fetch('/api/add', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...userData,
        title,
        desc
      })
    })
    req.then(data => {
      data.text().then(response => {
        console.log(response)
        setNoteTitle('')
        setNoteContent('')
        setNoteModalOpen(false)
        window.location.reload()
      })
    })
  }

  return (
      <div>

        <Modal width="100%" open={isNoteModalOpen} onClose={() => setNoteModalOpen(false)}>
            <Modal.Title>Create a new note</Modal.Title>
            <Modal.Content>
                <h4>Title:</h4>
                <Input value={noteTitle} onChange={event => setNoteTitle(event.target.value)} width="100%" placeholder="Note title..."></Input>
                <Spacer y={1} />
                <h4>Note Content (HTML & Markdown Supported):</h4>
                <div style={{ display: 'flex' }}>
                    <div style={{ width: '50%' }}>
                        <Textarea
                            onChange={event => setNoteContent(event.target.value)}
                            value={noteContent}
                            width="100%"
                            minHeight="350px"
                            placeholder="Note title..."
                        >
                        </Textarea>
                        <Spacer y={1} />
                        {/* <h4>Files:</h4>
                        <Input width="100%" type="file"></Input> */}
                    </div>
                    <div style={{ width: '50%', maxHeight: '350px', overflowX: 'scroll' }}>
                        <div style={{ minWidth: '50%', height: 'auto', padding: 12 }} dangerouslySetInnerHTML={{
                          __html: noteContentPreview
                        }}></div>
                    </div>
                </div>
            </Modal.Content>
            <Modal.Action passive onClick={() => setNoteModalOpen(false)}>Cancel</Modal.Action>
            <Modal.Action onClick={noteHanlder}>Upload</Modal.Action>
        </Modal>

        <Button
            icon={<Icon.PlusCircle />}
            type="secondary"
            style={{ marginBottom: 36 }}
            auto
            onClick={() => setNoteModalOpen(!isNoteModalOpen)}
        >
            New Note
        </Button>

        <Input
            icon={<Icon.Search />}
            placeholder="Search Titles, Descriptions or Tags..."
            width="100%"
            onChange={search}
            clearable
        />
        <div className={styles.cardContainer}>
            {
                notes.map((data, key) => (
                  <Note data={data} key={key} />
                ))
            }
        </div>
      </div>
  // <div>
  //     <h4>Write:</h4>
  //     <Textarea width="100%" />
  //     <Button type="secondary" style={{ marginTop: '12px', float: 'right' }}>Upload</Button>
  // </div>
  )
}

const Note = data => {
  data = data.data

  function markdownToHTML (data) {
    const converter = new showdown.Converter()
    return converter.makeHtml(data)
  }

  return (
    <Card className={styles.note} width="400px">
        <h4>{data.title}</h4>
        <p dangerouslySetInnerHTML={{ __html: markdownToHTML(data.desc) }} />
        <div>
        {/* {
            data.tags.map((tag, key) => (
                <Badge key={key} className={styles.badge}>{tag}</Badge>
            ))
        } */}
        </div>
    </Card>
  )
}
