import { Multiselect } from 'multiselect-react-dropdown'

export const MultipleSelect = ({
    label='',
    labelColor='',
    listdata= [],
    className='',
    placeholder='',
    selectedValue=[],
    onSelect = (val:any) => {},
    onRemove = (val: any) => {},
    displayValue=""
}) => {
    return (
        <div className={`relative`}>
            <label className={labelColor}>
                {label}
            </label>
            <Multiselect
                className={`input-base mt-2 ${className}`}
                options={listdata}
                placeholder={placeholder}
                selectedValues={selectedValue}
                onSelect={onSelect}
                onRemove={onRemove}
                displayValue={displayValue}
            />
        </div>
    )
}