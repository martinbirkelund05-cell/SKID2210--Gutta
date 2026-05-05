/* Hyppige formel-tokens som gjenbrukes */
/* Formler — KUN dei som står på det offisielle formelarket (Formelark.pdf).
   Forelesning- eller øvingsavhengige uttrykk er bevisst utelatt slik at
   alle øvingar her speglar det studenten faktisk har på eksamen.        */
const FX = {
  // ---- Grunnleggjande fluidmekanikk og fysikk ----
  hydro:    [["sub",["v","p"],"s"],["op","="],["g","ρ"],["op","·"],["v","g"],["op","·"],["v","z"]],
  bernoulli:[["v","p"],["op","+"],["frac","1","2"],["g","ρ"],["sup",["v","U"],"2"],["op","+"],["g","ρ"],["frac",["op","∂φ"],["op","∂t"]],["op","+"],["g","ρ"],["v","g"],["v","z"],["op","="],["v","C"]],
  cont_mass:[["sub",["v","ṁ"],"1"],["op","="],["sub",["v","ṁ"],"2"],["op","⇒"],["sub",["g","ρ"],"1"],["sub",["v","U̇"],"1"],["op","="],["sub",["g","ρ"],"2"],["sub",["v","U̇"],"2"]],
  cont_inc: ["∇",["op","·"],["v","U"],["op","="],["frac",["op","∂u"],["op","∂x"]],["op","+"],["frac",["op","∂v"],["op","∂y"]],["op","+"],["frac",["op","∂w"],["op","∂z"]],["op","="],"0"],
  laplace:  [["sup","∇","2"],["g","φ"],["op","="],"0"],
  vel_pot:  [["v","U"],["op","="],"∇",["g","φ"]],
  morison:  [["v","F"],["op","="],["sub",["v","F"],"D"],["op","+"],["sub",["v","F"],"M"],["op","="],["frac","1","2"],["g","ρ"],["sub",["v","C"],"D"],["v","A"],["v","u"],"|",["v","u"],"|",["op","+"],["g","ρ"],["sub",["v","C"],"M"],["v","V"],["v","a"]],

  // ---- Vindkraft ----
  P_wind:   [["v","P"],["op","="],["frac","1","2"],["g","η"],["g","ρ"],["v","A"],["sup",["v","U"],"3"]],
  betz:     [["sub",["g","η"],"Betz"],["op","="],["frac","16","27"]],

  // ---- Bølger (regulære) ----
  H_amp:    [["v","H"],["op","="],"2",["sub",["g","ζ"],"a"]],
  omega_T:  [["g","ω"],["op","="],["frac","2π",["v","T"]]],
  k_lambda: [["v","k"],["op","="],["frac","2π",["g","λ"]]],
  disp_fin: [["sup",["g","ω"],"2"],["op","="],["v","k"],["v","g"],["op","·"],"tanh",["v","k"],["v","h"]],
  disp_inf: [["sup",["g","ω"],"2"],["op","="],["v","k"],["v","g"]],
  c_phase_fin:[["v","c"],["op","="],["sqrt",[["frac",["v","g"],["v","k"]],["op","·"],"tanh",["v","k"],["v","h"]]]],
  c_phase_inf:[["v","c"],["op","="],["frac",["g","ω"],["v","k"]],["op","="],["sqrt",[["frac",["v","g"],["v","k"]]]]],

  // Bølgekinematikk (uendelig dyp - som mest brukt i øvingar)
  zeta_inf: [["g","ζ"],["op","="],["sub",["g","ζ"],"a"],"sin",["paren",[["g","ω"],["v","t"],["op","−"],["v","k"],["v","x"]]]],
  phi_inf:  [["g","φ"],["op","="],["frac",[["sub",["g","ζ"],"a"],["v","g"]],["g","ω"]],["sup","e",[["v","k"],["v","z"]]],"cos",["paren",[["g","ω"],["v","t"],["op","−"],["v","k"],["v","x"]]]],
  pD_inf:   [["sub",["v","p"],"D"],["op","="],["g","ρ"],["v","g"],["sub",["g","ζ"],"a"],["sup","e",[["v","k"],["v","z"]]],"sin",["paren",[["g","ω"],["v","t"],["op","−"],["v","k"],["v","x"]]]],
  u_inf:    [["v","u"],["op","="],["g","ω"],["sub",["g","ζ"],"a"],["sup","e",[["v","k"],["v","z"]]],"sin",["paren",[["g","ω"],["v","t"],["op","−"],["v","k"],["v","x"]]]],
  w_inf:    [["v","w"],["op","="],["g","ω"],["sub",["g","ζ"],"a"],["sup","e",[["v","k"],["v","z"]]],"cos",["paren",[["g","ω"],["v","t"],["op","−"],["v","k"],["v","x"]]]],
  ax_inf:   [["sub",["v","a"],"x"],["op","="],["sup",["g","ω"],"2"],["sub",["g","ζ"],"a"],["sup","e",[["v","k"],["v","z"]]],"cos",["paren",[["g","ω"],["v","t"],["op","−"],["v","k"],["v","x"]]]],
  az_inf:   [["sub",["v","a"],"z"],["op","="],["op","−"],["sup",["g","ω"],"2"],["sub",["g","ζ"],"a"],["sup","e",[["v","k"],["v","z"]]],"sin",["paren",[["g","ω"],["v","t"],["op","−"],["v","k"],["v","x"]]]],

  // Bølgekinematikk endelig dyp (cosh-uttrykk)
  u_fin:    [["v","u"],["op","="],["g","ω"],["sub",["g","ζ"],"a"],["frac","cosh k(h+z)","cosh kh"],"sin",["paren",[["g","ω"],["v","t"],["op","−"],["v","k"],["v","x"]]]],
  ax_fin:   [["sub",["v","a"],"x"],["op","="],["sup",["g","ω"],"2"],["sub",["g","ζ"],"a"],["frac","cosh k(h+z)","cosh kh"],"cos",["paren",[["g","ω"],["v","t"],["op","−"],["v","k"],["v","x"]]]],

  // ---- Forenkla forankringsformlar (kjedelinje) ----
  cat_z:    [["v","z"],["op","+"],["v","h"],["op","="],["frac",["sub",["v","T"],"H"],["v","w"]],["paren",[["op","cosh "],["paren",[["frac",[["v","w"],["v","x"]],["sub",["v","T"],"H"]]]],["op","−"],"1"]]],
  cat_s:    [["v","s"],["op","="],["frac",["sub",["v","T"],"H"],["v","w"]],["op","sinh"],["paren",[["frac",["v","x"],["v","a"]]]]],
  cat_T:    [["v","T"],["op","="],["sub",["v","T"],"H"],["op","cosh "],["paren",[["frac",[["v","w"],["v","x"]],["sub",["v","T"],"H"]]]]],
  cat_T_top:[["v","T"],["op","="],["sub",["v","T"],"H"],["op","+"],["v","w"],["v","h"]],

  // Hyperbolske
  cosh_def: [["op","cosh"],["paren",[["v","x"]]],["op","="],["frac",[["sup","e",["v","x"]],["op","+"],["sup","e",[["op","−"],["v","x"]]]],"2"]],
  sinh_def: [["op","sinh"],["paren",[["v","x"]]],["op","="],["frac",[["sup","e",["v","x"]],["op","−"],["sup","e",[["op","−"],["v","x"]]]],"2"]],

  // ---- Bølgedrift (Maruo + sirkulær sylinder) ----
  maruo_reg:  [["v","F"],["op","="],["frac","1","2"],["g","ρ"],["v","g"],["sup",["sub",["g","ζ"],"a"],"2"],["v","L"]],
  maruo_irreg:[["v","F"],["op","="],["frac","1","16"],["g","ρ"],["v","g"],["sup",["sub",["v","H"],"s"],"2"],["v","L"]],
  drift_cyl:  [["v","F"],["op","="],["frac","2","3"],["g","ρ"],["v","g"],["sup",["sub",["g","ζ"],"a"],"2"],["v","R"]]
};
