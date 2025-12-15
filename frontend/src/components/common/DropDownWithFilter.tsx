import { useEffect, useMemo, useState } from 'react'
import { Select, Spin } from 'antd'
import type { SelectProps } from 'antd'
import { useQuery } from '@tanstack/react-query'

export interface DropDownWithFilterOption {
  label: string
  value: string | number
}

export interface DropDownWithFilterProps extends Omit<SelectProps, 'options'> {
  fetchOptions: (keyword: string) => Promise<DropDownWithFilterOption[]>
  queryKeyPrefix: string
  debounceMs?: number
  fetchOnEmpty?: boolean
}

export function DropDownWithFilter({
  fetchOptions,
  queryKeyPrefix,
  debounceMs = 300,
  placeholder,
  fetchOnEmpty = false,
  ...rest
}: DropDownWithFilterProps) {
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), debounceMs)
    return () => clearTimeout(t)
  }, [search, debounceMs])

  const queryKey = useMemo(() => [queryKeyPrefix, debounced], [queryKeyPrefix, debounced])

  const { data: options = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => fetchOptions(debounced),
    enabled: fetchOnEmpty ? true : debounced.trim().length > 0,
  })

  return (
    <Select
      showSearch
      allowClear
      filterOption={false}
      placeholder={placeholder}
      onSearch={setSearch}
      notFoundContent={isLoading ? <Spin size="small" /> : null}
      options={options}
      {...rest}
    />
  )
}


