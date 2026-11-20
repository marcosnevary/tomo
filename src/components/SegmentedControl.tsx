type SegmentedControlProps<Value extends string> = {
  label: string
  name: string
  options: readonly { value: Value; label: string }[]
  defaultValue: Value
}

/**
 * Each segment is a hidden native radio button, so the form reads the choice like any
 * other field and the selected segment is styled from `:checked`, with no React state.
 */
function SegmentedControl<Value extends string>({
  label,
  name,
  options,
  defaultValue,
}: SegmentedControlProps<Value>) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm leading-none font-medium">{label}</legend>
      <div className="flex rounded-lg bg-muted p-0.5">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex h-7 flex-1 cursor-pointer items-center justify-center rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground has-checked:bg-background has-checked:text-foreground has-checked:shadow-sm has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              defaultChecked={option.value === defaultValue}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export { SegmentedControl }
