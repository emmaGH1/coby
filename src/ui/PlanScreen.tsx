import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Clock } from '../domain/clock';
import { calendarWeek } from '../domain/calendar';
import { isFromEarlierDay } from '../domain/ranking';
import type { CobyItem } from '../domain/types';
import { CheckIcon, TrashIcon } from './icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BackLink } from './controls';
import { colors, radius, type } from './theme';

export type PlanView = 'list' | 'calendar' | 'completed' | 'earlier';

type Props = { items:CobyItem[]; clock:Clock; busy:boolean; dueText:(item:CobyItem)=>string; initialView?:PlanView; onViewChange:(view:PlanView)=>void;
  onEdit:(item:CobyItem)=>void; onDelete:(item:CobyItem)=>void;
  onFocus:(item:CobyItem)=>void; onToggleComplete:(item:CobyItem)=>void;
  onClear:()=>void };

export function PlanScreen(props:Props) {
  const [mode,setMode]=useState<PlanView>(props.initialView ?? 'list');
  function changeMode(view:PlanView){setMode(view);props.onViewChange(view)}
  const [offset,setOffset]=useState(0);
  const [day,setDay]=useState(()=>props.clock.now().toDateString());
  const week=calendarWeek(props.clock,offset);
  const held=props.items.filter(item=>item.status!=='archived');
  const completed=held.filter(item=>item.status==='completed');
  const earlier=held.filter(item=>item.status!=='completed'&&isFromEarlierDay(item,props.clock));
  const matches=(item:CobyItem)=>item.dueAt?new Date(item.dueAt).toDateString()===day:item.dueDate?new Date(`${item.dueDate}T12:00:00`).toDateString()===day:false;
  const shown=mode==='completed'?completed:mode==='earlier'?earlier:mode==='calendar'?held.filter(matches):held;
  function changeWeek(value:number){const next=offset+value;setOffset(next);setDay(calendarWeek(props.clock,next)[0].toDateString())}
  return <View style={styles.screen}>
    <Text style={styles.title}>Plan</Text><Text style={styles.intro}>Everything you’ve handed over.</Text>
    <View style={styles.segment}>{(['list','calendar'] as const).map(value=><Pressable key={value} accessibilityRole="button" accessibilityState={{selected:mode===value}} onPress={()=>changeMode(value)} style={[styles.segmentButton,mode===value&&styles.segmentActive]}><Text style={styles.segmentText}>{value==='list'?'List':'Calendar'}</Text></Pressable>)}</View>
    <View style={styles.toolbar}>{mode==='completed'||mode==='earlier'?<BackLink label="Held list" onPress={()=>changeMode('list')}/>:<Pressable accessibilityRole="button" onPress={()=>changeMode('completed')} style={styles.history}><Text style={styles.link}>Completed · {completed.length}</Text></Pressable>}
      {earlier.length>0&&mode!=='earlier'&&<Pressable accessibilityRole="button" onPress={()=>changeMode('earlier')} style={styles.history}><Text style={styles.link}>Earlier · {earlier.length}</Text></Pressable>}</View>
    {mode==='calendar'&&<>
      <View style={styles.weekHeader}><Pressable accessibilityRole="button" accessibilityLabel="Previous week" onPress={()=>changeWeek(-1)} style={styles.weekArrow}><Ionicons name="chevron-back" size={22} color={colors.violetDeep}/></Pressable>
        <Text style={styles.month}>{week[0].toLocaleDateString(undefined,{month:'long',year:'numeric'})}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Next week" onPress={()=>changeWeek(1)} style={styles.weekArrow}><Ionicons name="chevron-forward" size={22} color={colors.violetDeep}/></Pressable>
        <Pressable accessibilityRole="button" onPress={()=>{setOffset(0);setDay(props.clock.now().toDateString())}} style={styles.today}><Text style={styles.link}>Today</Text></Pressable></View>
      <View style={styles.days}>{week.map(date=><Pressable key={date.toDateString()} accessibilityRole="button" accessibilityLabel={date.toDateString()} accessibilityState={{selected:day===date.toDateString()}} onPress={()=>setDay(date.toDateString())} style={styles.day}><Text style={styles.weekday}>{date.toLocaleDateString(undefined,{weekday:'short'})}</Text><View style={[styles.dateCircle,day===date.toDateString()&&styles.dateSelected]}><Text style={[styles.dateNumber,day===date.toDateString()&&styles.dateTextSelected]}>{date.getDate()}</Text></View><View style={[styles.dayDot,!held.some(item=>item.dueAt?new Date(item.dueAt).toDateString()===date.toDateString():item.dueDate?new Date(`${item.dueDate}T12:00:00`).toDateString()===date.toDateString():false)&&styles.noDot]}/></Pressable>)}</View>
    </>}
    {mode==='completed'&&<Text style={styles.intro}>Your completed items stay here. Tap a checkmark to bring one back.</Text>}
    {mode==='earlier'&&<Text style={styles.intro}>These dates have passed. Nothing is lost. Edit to reschedule, mark done, or delete what you no longer need.</Text>}
    {shown.map(item=><View key={item.id} style={styles.row}>
      <View style={styles.rowMain}><Pressable accessibilityRole="button" accessibilityLabel={`${item.status==='completed'?'Restore':'Complete'} ${item.title}`} disabled={props.busy} onPress={()=>props.onToggleComplete(item)} style={styles.checkTarget}><View style={[styles.ring,item.status==='completed'&&styles.ringChecked]}>{item.status==='completed'&&<CheckIcon color={colors.white}/>}</View></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={`Edit ${item.title}`} onPress={()=>props.onEdit(item)} disabled={props.busy} style={styles.itemBody}><Text style={[styles.itemTitle,item.status==='completed'&&styles.crossed]}>{item.title}</Text>{props.dueText(item)?<Text style={styles.meta}>{item.status!=='completed'&&isFromEarlierDay(item,props.clock)?'Earlier · ':''}{props.dueText(item)}</Text>:null}</Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={`Delete ${item.title}`} disabled={props.busy} onPress={()=>props.onDelete(item)} style={styles.iconTarget}><TrashIcon/></Pressable></View>
      {item.status!=='completed'&&<View style={styles.rowActions}><Pressable accessibilityRole="button" disabled={props.busy} onPress={()=>props.onFocus(item)} style={styles.smallAction}><Text style={styles.link}>Focus</Text></Pressable></View>}
    </View>)}
    {!shown.length&&<Text style={styles.empty}>{mode==='completed'?'No completed items yet.':mode==='earlier'?'Nothing from earlier needs review.':mode==='calendar'?'A little breathing room. Nothing on this day.':'Your held list is clear.'}</Text>}
    {mode==='calendar'&&<Text style={styles.intro}>Items without a date are in List.</Text>}
    {mode==='list'&&held.some(item=>item.status!=='completed')&&<Pressable accessibilityRole="button" disabled={props.busy} onPress={props.onClear} style={styles.clear}><TrashIcon/><Text style={styles.clearText}>Clear list</Text></Pressable>}
  </View>;
}
const styles=StyleSheet.create({
  dayDot:{width:4,height:4,borderRadius:radius.pill,backgroundColor:colors.violetDeep},noDot:{opacity:0},
  screen:{gap:16},title:{fontFamily:type.bold,fontSize:32,color:colors.ink},intro:{fontFamily:type.regular,fontSize: 14,lineHeight:21,color:colors.muted},
  link:{fontFamily:type.medium,fontSize: 14,color:colors.violetDeep},segment:{flexDirection:'row',backgroundColor:colors.hairline,padding:3,borderRadius:radius.pill},segmentButton:{flex:1,minHeight:48,alignItems:'center',justifyContent:'center',borderRadius:radius.pill},segmentActive:{backgroundColor:colors.white},segmentText:{fontFamily:type.semibold,fontSize: 14,color:colors.ink},
  toolbar:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},history:{minHeight:48,justifyContent:'center'},clear:{minHeight:48,flexDirection:'row',alignItems:'center',gap:6},clearText:{fontFamily:type.regular,fontSize: 14,color:colors.muted},
  weekHeader:{flexDirection:'row',alignItems:'center'},weekArrow:{width:48,minHeight:48,alignItems:'center',justifyContent:'center'},month:{fontFamily:type.semibold,fontSize:16,color:colors.ink},today:{marginLeft:'auto',minHeight:48,justifyContent:'center'},days:{flexDirection:'row'},day:{flex:1,alignItems:'center',minHeight:70,gap:8},weekday:{fontFamily:type.regular,fontSize: 14,color:colors.muted},dateCircle:{width:34,height:34,borderRadius:radius.pill,alignItems:'center',justifyContent:'center'},dateSelected:{backgroundColor:colors.violetDeep},dateNumber:{fontFamily:type.semibold,fontSize:14,color:colors.ink},dateTextSelected:{color:colors.white},
  row:{borderBottomWidth:1,borderBottomColor:colors.hairline,paddingVertical:10,gap:2},rowMain:{flexDirection:'row',alignItems:'center'},checkTarget:{width:48,minHeight:48,alignItems:'center',justifyContent:'center'},ring:{height:20,width:20,borderRadius:radius.pill,borderWidth:1,borderColor:colors.muted,alignItems:'center',justifyContent:'center'},ringChecked:{backgroundColor:colors.violetDeep,borderColor:colors.violetDeep},itemBody:{flex:1,minHeight:48,justifyContent:'center',gap:4},itemTitle:{fontFamily:type.semibold,fontSize:16,lineHeight:24,color:colors.ink},crossed:{textDecorationLine:'line-through',color:colors.muted},meta:{fontFamily:type.regular,fontSize: 14,lineHeight:20,color:colors.muted},iconTarget:{width:48,minHeight:48,alignItems:'center',justifyContent:'center'},rowActions:{flexDirection:'row',gap:20,marginLeft:48},smallAction:{minHeight:48,justifyContent:'center'},empty:{fontFamily:type.regular,fontSize:14,lineHeight:23,color:colors.muted,paddingVertical:30},
});
