// ================================================================
// ExamenSeries.jsx — INDICATEUR DES 3 SÉRIES DE L'EXAMEN
// ================================================================
// Props :
//   - serieActuelle → 0, 1 ou 2 (index 0-based de la série courante)
// ================================================================

import './ExamenSeries.css'

export function ExamenSeries({ serieActuelle }) {
  return (
    <div className="examen-series">
      {[1, 2, 3].map((s) => {
        let classe = 'examen-series-badge--future'
        if (s === serieActuelle + 1) classe = 'examen-series-badge--actif'
        else if (s < serieActuelle + 1) classe = 'examen-series-badge--termine'

        return (
          <div key={s} className={`examen-series-badge ${classe}`}>
            Série {s}
          </div>
        )
      })}
    </div>
  )
}
