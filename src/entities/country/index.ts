export interface CountrySelectItem {
  title: string
  value: string
}

const isValidCountryCode = (id: string | undefined): boolean => Boolean(id && id.length >= 2)

const toSelectItem = (country: Country): CountrySelectItem => ({
  title: country.name,
  value: country.id,
})

export const toCountrySelectItems = (countries: Country[]): CountrySelectItem[] =>
  countries.filter(c => isValidCountryCode(c.id)).map(toSelectItem)
