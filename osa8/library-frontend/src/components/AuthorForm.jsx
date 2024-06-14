import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import Select from 'react-select'

import { EDIT_AUTHOR } from '../queries'

export const AuthorForm = ({ authors }) => {
  const [born, setBorn] = useState('')
  const [selectedOption, setSelectedOption] = useState(null)

  const options = authors.map((a) => {
    return {
      value: a.name,
      label: a.name,
    }
  })

  const [changeBirthyear, result] = useMutation(EDIT_AUTHOR)

  const submit = async (event) => {
    event.preventDefault()

    changeBirthyear({
      variables: { name: selectedOption.value, born: Number(born) },
    })
    setBorn('')
  }

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      console.log('author not found')
    }
  }, [result.data])

  return (
    <div>
      <h2>set birthyear</h2>
      <form onSubmit={submit}>
        <Select
          defaultValue={selectedOption}
          onChange={setSelectedOption}
          options={options}
        />
        <div>
          born{' '}
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}
