const plugin = require('tailwindcss/plugin')
  ;
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        complimentary: "var(--complimentary)",
        secondary: "var(--secondary)",
        main: {
          200: "var(--main-200)",
          500: "var(--main-500)",
          600: "var(--main-600)",
          700: "var(--main-700)",
          800: "var(--main-800)",
          900: "var(--main-900)"
        },

      },
      boxShadow: {
        DEFAULT: "0px 3px 12px rgba(0,0,0,0.63)",
        md: "0px 3px 12px rgba(0,0,0,0.1)"
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opactiy: 1 }
        },
        scaleIn: {
          '0%': {
            opacity: 0,
            transform: 'scale(0.9)'
          },
          '50%': {
            opacity: 0.3
          },
          '100%': {
            opacity: 1,
            transform: 'scale(1)'
          }
        },
        countDown: {
          '0%': {
            width: '100%',
          },
          '100%': {
            width: '0%'
          }

        },
        loading: {
          '0%': {
            transform: 'translateX(-150%)'
          },
          '50%': {
            transform: 'translateX(-60%)'
          },
          '100%': {
            transform: 'translateX(150%)'
          }

        },
        hover_effect: {
          '0%': {
            boxShadow: '0 0 1px #fff, 0 0 2px #fff, 0 0 3px #FF7652, 0 0 4px #FF7652, 0 0 5px #FF7652'
          },
          '100%': {
            boxShadow: '0 0 2px #fff, 0 0 4px #fff, 0 0 6px #FF7652, 0 0 8px #FF7652, 0 0 10px #FF7652'
          }
        },
        slideInLeft: {
          '0%': {
            transform: 'translateX(-100%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateX(0%)',
            opacity: '1'
          }
        },
        slideInTop: {
          '0%': {
            transform: 'translateY(-100%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0%)',
            opacity: '1'
          }
        },
        slideInRight: {
          '0%': {
            transform: 'translateX(100%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateX(0%)',
            opacity: '1'
          }
        },
        slideInBottom: {
          '0%': {
            transform: 'translateY(100%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0%)',
            opacity: '1'
          }
        },
        scaleDown: {
          "0%": {
            transform: 'scale(2.5)',
            opacity: '0.4'
          },
          "100%": {
            transform: 'scale(1)',
            opacity: '1'
          }
        },
        spin: {
          "0%": {
            transform: 'rotate(0deg)'
          },
          "100%": {
            transform: 'rotate(360deg)'
          }
        },
        openPage: {
          "0%": {
            transform: 'rotateX(20deg) rotateY(0deg)'

          },
          "100%": {
            transform: 'rotateX(20deg) rotateY(-180deg)',

          }
        }


      },
      fontSize: {
        xs: '.9rem',
        sm: '1rem',
        tiny: '1.2rem',
        base: '1.4rem',
        lg: '1.5rem',
        xl: '1.5rem',
        '2xl': '1.75rem',
        '3xl': '1.9rem',
        '4xl': '2.5rem',
        '5xl': '3.5rem',
        '6xl': '4.5rem',
        '7xl': '5.5rem'
      },
      animation: {
        fadeIn: 'fadeIn .5s ease-in-out',
        scaleIn: 'scaleIn .35s ease-in-out',
        progressCountDown: 'countDown 5s ease',
        loading: 'loading 2s ease infinite',
        hover_effect: 'hover_effect 1s ease infinite',
        slideInBottom: 'slideInBottom .35s ease',
        slideInLeft: 'slideInLeft .35s ease',
        slideInRight: 'slideInRight .35s ease',
        slideInTop: 'slideInTop .35s ease',
        scaleDown: 'scaleDown .15s ease',
        spin: 'spin  .5s cubic-bezier(0, 0, 0, 0) infinite',
        openPage: 'openPage 3s cubic-bezier(0, 0, 0, 0)'

      }
    },
  },
  plugins: [
    plugin(({ addComponents }) => {
      addComponents({
        '.shadow-block': {
          display: 'block',
          boxShadow:
            '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          animation: 'scaleIn .35s ease-in-out',
          backgroundColor: '#272532'
        }
      })
    })
  ],
}
